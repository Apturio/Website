import { useLanguage } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function PayPerUse() {
  const { language } = useLanguage();
  useSEO("Pay-Per-Use Pricing - Apturio", "Detailed breakdown of our pay-per-use pricing.");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
          </Link>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Pay-Per-Use Pricing</h1>
            <p className="text-slate-400 text-lg">Detailed breakdown of variable costs (Updated May 2026).</p>
          </div>

          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-bold mb-6 text-white border-b border-border pb-2">Telecom (Phone & SMS)</h2>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Service</TableHead><TableHead className="text-right">Price</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>Making calls per min (US/CAN)</TableCell><TableCell className="text-right">{language === 'es' ? '$0,0560' : '$0.0560'}</TableCell></TableRow>
                  <TableRow><TableCell>Receiving calls per min (US/CAN)</TableCell><TableCell className="text-right">{language === 'es' ? '$0,0340' : '$0.0340'}</TableCell></TableRow>
                  <TableRow><TableCell>Text messages per segment (US/CAN)</TableCell><TableCell className="text-right">{language === 'es' ? '$0,0332' : '$0.0332'}</TableCell></TableRow>
                </TableBody>
              </Table>
            </section>
            {/* Repite la misma estructura de <Table> para Email, WhatsApp, AI, etc. */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
