# RADAR — Auction Broker

Calculadora para analizar autos de Copart: costos de compra, daños (body shop y
mecánico), fuentes de partes y estimado de precio de venta con comparables.

**Nota:** esta versión NO incluye el análisis de fotos con IA — se quitó a propósito
para lanzar sin ningún costo de API. El resto de la calculadora funciona 100% completo.
Cuando quieras reactivar el análisis con IA más adelante, hay que volver a agregar la
función serverless y la tarjeta de subida de fotos (dile a Claude cuando llegue ese momento).

## 1. Sube el proyecto a GitHub

Necesitas [Node.js](https://nodejs.org) instalado (versión 18+) solo si quieres probarlo
en tu computadora antes de subirlo — para desplegarlo no es obligatorio.

1. Crea un repositorio nuevo en GitHub (puede ser privado).
2. Desde esta carpeta:

```bash
git init
git add .
git commit -m "RADAR — Auction Broker"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

## 2. Despliega en Vercel (gratis, sin API key necesaria)

1. Ve a **https://vercel.com** y crea una cuenta (puedes entrar directo con GitHub).
2. Click **Add New → Project** e importa el repositorio que acabas de subir.
3. Vercel detecta automáticamente que es un proyecto Vite — no cambies nada en "Build settings".
4. Click **Deploy**. En 1-2 minutos te da una URL tipo `tu-proyecto.vercel.app` — ya
   funcional y gratis, sin ninguna variable de entorno que configurar.

## 3. Conecta tu propio dominio (opcional)

1. Compra el dominio donde quieras (Namecheap, Cloudflare, GoDaddy, etc.) — o usa un
   subdominio de uno que ya tengas.
2. En Vercel, entra a tu proyecto → **Settings → Domains** → agrega tu dominio.
3. Vercel te da 1-2 registros DNS (normalmente un `A` o `CNAME`) para agregar en el
   panel de tu proveedor de dominio.
4. Espera a que propague (minutos a un par de horas) — Vercel activa HTTPS automáticamente.

## Cuando quieras agregar el análisis de fotos con IA más adelante

Vas a necesitar:
- Una API key de Anthropic (console.anthropic.com), con un límite de gasto mensual
  configurado — importante porque en cuanto la app sea pública, cualquiera que use
  esa función gasta créditos de tu cuenta.
- Una función serverless (`api/analyze.js`) que actúe de intermediario, para que la
  key nunca quede expuesta en el navegador del visitante.
- Agregar de vuelta la tarjeta de "Subir fotos" en la pestaña de Daños.

Cuando llegue ese momento, dile a Claude "quiero reactivar el análisis de fotos con IA"
y se reconstruye esa parte sobre esta misma base.

## Estructura del proyecto

```
├── src/
│   ├── App.jsx          ← la calculadora completa
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```
