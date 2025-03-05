import otelapi, { type Tracer } from "@opentelemetry/api";
import { context, propagation, SpanKind, SpanStatusCode, trace } from "@opentelemetry/api";
import type { MiddlewareHandler } from "hono";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { customLogger } from "./logging.js";

interface Logger {
    error: (x: any) => any;
}

let otel: typeof otelapi | undefined = otelapi;
let rawTracer: Tracer | undefined;

export const opentelemetryMiddleware =
    (logger: Logger): MiddlewareHandler =>
    async (ctx, next) => {
        if (!otel) {
            try {
                await next();
                if (ctx.error) {
                    logger.error({ error: ctx.error.message });
                }
            } catch (error) {
                logger.error({
                    error: error instanceof Error ? error.message : "unknown error",
                });
                throw error;
            }
            return;
        }

        if (!rawTracer) {
            // Create a tracer provider
            const provider = new NodeTracerProvider();

            // Create an OTLP exporter (it will use the environment variables for protocol and endpoint)
            const otlpExporter = new OTLPTraceExporter();

            // Use a batch span processor to send spans in batches
            provider.addSpanProcessor(new BatchSpanProcessor(otlpExporter));
            // Register the provider so that spans are recorded
            provider.register();
            rawTracer = provider.getTracer("hono-poc", "0.0.0");
        }

        const span = rawTracer.startSpan(
            "opentelemetry.infrastructure.middleware",
            {
                attributes: {
                    "http.method": ctx.req.method,
                    "http.url": ctx.req.url,
                },
                kind: SpanKind.SERVER,
            },
            propagation.extract(context.active(), ctx.req.raw.headers),
        );

        try {
            await context.with(trace.setSpan(context.active(), span), async () => {
                await next();
            });
            if (ctx.error) {
                logger.error({ error: ctx.error.message });
                span.recordException(ctx.error);
                span.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: ctx.error.message,
                });
            } else {
                span.setStatus({ code: SpanStatusCode.OK });
            }
        } catch (error) {
            logger.error({
                error: error instanceof Error ? error.message : "unknown error",
            });
            span.recordException(error as Error);
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error instanceof Error ? error.message : "unknown error",
            });
            throw error;
        }
        span.end();
    };
