import PlaceholderScreen from "@/components/PlaceholderScreen";

export default function NotFoundScreen() {
  return (
    <PlaceholderScreen
      title="Página não encontrada"
      description="O endereço que você tentou acessar não existe."
      icon="map-marker-question-outline"
      backHref="/"
      safeArea
    />
  );
}