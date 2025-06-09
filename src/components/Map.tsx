"use client";

const Map = () => {
  return (
    <div className="w-full h-[500px] relative overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.6602455170914!2d-49.25438282460996!3d-25.449619977549347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce4fa6efc3181%3A0x8b0f452491a6f477!2sPUCPR%20-%20Pontif%C3%ADcia%20Universidade%20Cat%C3%B3lica%20do%20Paran%C3%A1!5e0!3m2!1spt-BR!2sbr!4v1749169198929!5m2!1spt-BR!2sbr"
        className="absolute inset-0 w-full h-full border-0"
        title="Localização da PUCPR"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        aria-label="Mapa mostrando a localização da PUCPR"
      />
    </div>
  );
};

export default Map;