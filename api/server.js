import nodemailer from "nodemailer";

// Verificar credenciales una sola vez fuera de la función (optimiza rendimiento)
const hasCredentials = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

let transporter = null;
if (hasCredentials) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Vercel exporta una función por defecto que maneja la petición
export default async function handler(req, res) {
  // Manejo de CORS manual para que tu React pueda consultarlo desde producción
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Si es una petición de tipo OPTIONS (preflight de CORS), respondemos con 200
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitimos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { name, email, phone, service, message } = req.body ?? {};

  if (!hasCredentials || !transporter) {
    return res.status(500).json({ error: "No hay credenciales SMTP configuradas en las variables de entorno de Vercel." });
  }

  if (!name || !email || !service) {
    return res.status(400).json({ error: "Nombre, correo y servicio son obligatorios." });
  }

  const html = `
    <p>Nueva solicitud de cotización desde el formulario de Intelcom.</p>
    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
    <p><strong>Correo del cliente:</strong> ${escapeHtml(email)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(phone || "-")}</p>
    <p><strong>Servicio solicitado:</strong> ${escapeHtml(service)}</p>
    <p><strong>Mensaje:</strong><br/>${escapeHtml(message || "-").replace(/\n/g, "<br/>")}</p>
  `;

  const subject = service
    ? `Solicitud de cotización: ${service} - ${name}`
    : `Solicitud de cotización de ${name}`;

  const text = `Nueva solicitud de cotización desde el formulario de Intelcom.\n\nNombre: ${name}\nCorreo del cliente: ${email}\nTeléfono: ${phone || "-"}\nServicio solicitado: ${service || "-"}\n\nMensaje:\n${message || "-"}`;

  try {
    await transporter.sendMail({
      from: `${name} <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || "intelcom57@gmail.com",
      subject,
      text,
      html,
      replyTo: email,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return res.status(500).json({ error: "Error interno al enviar el correo." });
  }
}