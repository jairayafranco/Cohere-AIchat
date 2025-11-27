import { NextResponse } from 'next/server';

// Configuración de rate limiting
const RATE_LIMIT_CONFIG = {
    maxRequests: 10, // Máximo de requests
    windowMs: 60000, // Ventana de tiempo en ms (1 minuto)
};

// Almacenamiento en memoria de IPs y sus requests
// NOTA: Se resetea con cada deploy, pero es suficiente para protección básica
const requestCounts = new Map();

/**
 * Obtiene la IP del cliente
 */
function getClientIP(request) {
    // Intentar obtener IP de headers de Vercel/Cloudflare
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    // Fallback a IP genérica si no se puede determinar
    return 'unknown';
}

/**
 * Limpia requests antiguos de la memoria
 */
function cleanupOldRequests() {
    const now = Date.now();
    for (const [ip, data] of requestCounts.entries()) {
        if (now - data.resetTime > RATE_LIMIT_CONFIG.windowMs) {
            requestCounts.delete(ip);
        }
    }
}

/**
 * Verifica si la IP ha excedido el rate limit
 */
function checkRateLimit(ip) {
    const now = Date.now();
    const requestData = requestCounts.get(ip);

    if (!requestData) {
        // Primera request de esta IP
        requestCounts.set(ip, {
            count: 1,
            resetTime: now,
        });
        return { allowed: true, remaining: RATE_LIMIT_CONFIG.maxRequests - 1 };
    }

    // Verificar si la ventana de tiempo ha expirado
    if (now - requestData.resetTime > RATE_LIMIT_CONFIG.windowMs) {
        // Resetear contador
        requestCounts.set(ip, {
            count: 1,
            resetTime: now,
        });
        return { allowed: true, remaining: RATE_LIMIT_CONFIG.maxRequests - 1 };
    }

    // Incrementar contador
    requestData.count++;

    if (requestData.count > RATE_LIMIT_CONFIG.maxRequests) {
        const resetIn = Math.ceil((RATE_LIMIT_CONFIG.windowMs - (now - requestData.resetTime)) / 1000);
        return {
            allowed: false,
            remaining: 0,
            resetIn
        };
    }

    return {
        allowed: true,
        remaining: RATE_LIMIT_CONFIG.maxRequests - requestData.count
    };
}

export function middleware(request) {
    // Solo aplicar rate limiting a la API de chat
    if (request.nextUrl.pathname === '/api/chat') {
        // Limpiar requests antiguos periódicamente
        if (Math.random() < 0.1) { // 10% de probabilidad en cada request
            cleanupOldRequests();
        }

        const ip = getClientIP(request);
        const { allowed, remaining, resetIn } = checkRateLimit(ip);

        if (!allowed) {
            return NextResponse.json(
                {
                    error: `Demasiadas solicitudes. Por favor, espera ${resetIn} segundos.`,
                    retryAfter: resetIn
                },
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': resetIn.toString(),
                        'Retry-After': resetIn.toString(),
                    }
                }
            );
        }

        // Agregar headers de rate limit a la respuesta
        const response = NextResponse.next();
        response.headers.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/chat',
};
