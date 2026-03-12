import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg mx-4 shadow-xl border-gray-100 rounded-2xl overflow-hidden">
        <CardContent className="pt-12 pb-12 px-8 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>

          <p className="text-base text-gray-500 max-w-sm mx-auto mb-8">
            We couldn't find the page you're looking for. The link might be broken, or the page may have been removed.
          </p>

          <Link href="/">
            <Button className="h-12 px-8 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to Safety
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
