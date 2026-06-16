"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export function DemoForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    const trackingPayload = {
      type: "external_form_submission",
      timestamp: Date.now(),
      formId: "Demo Request Form",
      formData: {
        first_name: name.split(" ")[0],
        last_name: name.split(" ").slice(1).join(" ") || "",
        email: email,
      },
      formLabels: {
        first_name: "First Name",
        last_name: "Last Name",
        email: "Email",
      },
      url: window.location.href,
      title: document.title,
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      trackingId: "tk_3ba16c3ab996435c83b6426f8cffb7e5",
      locationId: "8m7klvY1S28UqDyYn3EQ",
      sessionId: crypto.randomUUID(),
      properties: {
        deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop",
      },
    };

    fetch("https://backend.leadconnectorhq.com/external-tracking/events", {
      method: "POST",
      headers: { "Content-Type": "application/json", version: "2021-07-28" },
      body: JSON.stringify(trackingPayload),
    }).catch(() => {});

    setTimeout(() => {
      setIsLoading(false);
      router.push(`/${locale}/demo-spanish/thank-you`);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold font-heading tracking-tight">Apturio</span>
        </div>
      </div>

      <Card className="border-primary/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] shadow-primary/10">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">Accede a tu Demo</CardTitle>
          <CardDescription className="text-base">
            Descubre cómo nuestro sistema CRM con IA puede transformar tus ventas. Ingresa tus datos para recibir el acceso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" name="name" placeholder="Ej. Juan Pérez" required className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="tu@correo.com" required className="bg-muted/50" />
            </div>
            <Button type="submit" className="w-full text-lg h-12 mt-2" disabled={isLoading}>
              {isLoading ? "Procesando..." : "Recibir Demo Ahora"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Tus datos están seguros. No compartimos tu información.
      </p>
    </div>
  );
}
