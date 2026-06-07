import { useSEO } from "@/hooks/use-seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Bot } from "lucide-react";

const DemoThankYou = () => {
  useSEO("¡Gracias! - Apturio", "Tu demo está en camino.", true);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-primary/30">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold font-heading tracking-tight">Apturio</span>
          </div>
        </div>

        <Card className="border-primary/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] shadow-primary/10 text-center">
          <CardHeader className="space-y-4 pt-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">¡Tu demo está en camino!</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <p className="text-muted-foreground text-lg">
              Revisa tu bandeja de entrada en los próximos minutos. Te hemos enviado el enlace de acceso directo al correo que proporcionaste.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoThankYou;
