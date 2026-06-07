import { useLanguage } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function AddOns() {
  const { language } = useLanguage();
  useSEO("Add-Ons Pricing - Apturio", "Detailed breakdown of our premium add-ons and monthly pricing.");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const formatPrice = (price: string) => language === 'es' ? price.replace('.', ',') : price;

  const addOns = [
    { name: "Whatsapp Connector", price: "$29.99" },
    { name: "WordPress", price: "$14.99" },
    { name: "AI Employee (Unlimited AI)*", price: "$200.00" },
    { name: "Workflow Pro - Pricing Tiers - Starter", price: "$20.00" },
    { name: "Workflow Pro - Pricing Tiers - Growth", price: "$50.00" },
    { name: "Workflow Pro - Pricing Tiers - Scale", price: "$100.00" },
    { name: "Dedicated IP", price: "$150.00" },
    { name: "Ad Manager", price: "$97.00" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
          </Link>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading text-white">
              {language === 'es' ? 'Precios de Complementos (Add-Ons)' : 'Add-Ons Pricing'}
            </h1>
            <p className="text-slate-400 text-lg">
              {language === 'es'
                ? 'Desglose detallado de nuestros complementos premium (Actualizado Mayo 2026).'
                : 'Detailed breakdown of our premium add-ons (Updated May 2026).'}
            </p>
            <p className="text-xs text-slate-500 mt-4 italic">
              {language === 'es' ? 'Nota: Todos los precios son por mes y están sujetos a cambios.' : 'Note: All prices are per month and subject to change.'}
            </p>
          </div>

          <div className="space-y-16">
            <section>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-slate-300">{language === 'es' ? 'Complemento (Add-On)' : 'Add-On'}</TableHead>
                    <TableHead className="text-right text-slate-300">{language === 'es' ? 'Precio por mes' : 'Price per month'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addOns.map((addon, index) => (
                    <TableRow key={index} className="border-border/50 hover:bg-white/5">
                      <TableCell className="text-slate-400">{addon.name}</TableCell>
                      <TableCell className="text-right text-white font-medium">{formatPrice(addon.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
            <div className="mt-8">
              <p className="text-xs text-slate-500 italic">
                * {language === 'es'
                  ? 'El uso de Empleados IA (IA Ilimitada) está sujeto a una política de uso justo (fair usage policy).'
                  : 'AI Employee (Unlimited AI) is subject to a fair usage policy.'}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
