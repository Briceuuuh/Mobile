import { IconCard, IconTickets } from "../icon";

export const formatDate = (timestamp) => {
  if (!timestamp) return "Date inconnue";
  const date = new Date(
    timestamp.seconds ? timestamp.seconds * 1000 : timestamp
  );
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Fonction pour obtenir la couleur du statut
export const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "#28a745";
    case "cancelled":
      return "#dc3545";
    default:
      return "#6c757d";
  }
};

// Fonction pour obtenir le texte du statut
export const getStatusText = (status) => {
  switch (status) {
    case "completed":
      return "Terminé";
    case "cancelled":
      return "Annulé";
    default:
      return "Inconnu";
  }
};

// Fonction pour obtenir l'icône du statut
export const getStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return <IconCard />;
    case "cancelled":
      return <IconCard />;
    default:
      return <IconTickets />;
  }
};
