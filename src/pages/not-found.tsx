import { Button, Container } from "@/components/site/primitives";

export default function NotFoundPage() {
  return (
    <Container className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl font-bold text-gradient sm:text-8xl">
        404
      </p>
      <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
        Page not found
      </h2>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button to="/" variant="cta" size="lg" className="mt-8">
        Back home
      </Button>
    </Container>
  );
}
