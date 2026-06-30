import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5174;

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("⚠️ Faltan variables de entorno EMAIL_USER y EMAIL_PASS. Revisa .env o la configuración del servidor.");
}

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

  transporter.verify((error) => {
    if (error) {
      console.error("SMTP verification failed:", error);
    } else {
      const user = process.env.EMAIL_USER ?? "<no user>";
      console.log(`SMTP listo. Envíos desde ${user}`);
    }
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

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, service, message } = req.body ?? {};

  if (!hasCredentials || !transporter) {
    return res.status(500).json({ error: "No hay credenciales SMTP configuradas. Crea un archivo .env con EMAIL_USER y EMAIL_PASS." });
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
});

app.listen(PORT, () => {
  console.log(`API de contacto corriendo en http://localhost:${PORT}`);
});
