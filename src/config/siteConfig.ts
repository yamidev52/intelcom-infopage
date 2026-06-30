export const SITE = {
  companyName: "Intelcom",
  email: {
    // dirección de contacto real/operativa usada para reply/to
    display: "intelcom57@gmail.com",
  },
  phones: {
    primary: "+52 55 5881 0066",
    primaryHref: "tel:+525558810066",
    footer: "+52 55 5881 0066",
    footerHref: "tel:+525558810066",
  },
  whatsappNumber: "5519165383",
  address: {
    display: "Cuautitlán Izcalli, Méx",
    mapUrl:
      "https://www.google.com/maps/dir//Intelcom,+Multi+Plaza+Izcalli,+Dr.+J.+Jiménez+Cantú+Mz.+C-24-C+Lt.+S-24,+Centro+Urbano,+54700+Cuautitlán+Izcalli,+Méx./@19.6539471,-99.2009822,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x85d21e3940c04d21:0x55be2d9a24bcb51c!2m2!1d-99.2077844!2d19.6488824?entry=ttu&g_ep=EgoyMDI2MDYyMy4wIKXMDSoASAFQAw%3D%3D",
  },
};

export function getWhatsAppLink(text?: string) {
  return text
    ? `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${SITE.whatsappNumber}`;
}

export default SITE;
