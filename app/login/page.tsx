"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { STATS_DATA } from "@/lib/common-utils";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Heart, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: userLoading } = useFirebaseAuth();

  //  Redirect only from here
  useEffect(() => {
    if (!userLoading && user) {
      router.replace("/");
    }
  }, [user, userLoading, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Welcome! 🎉");
      //  router.push yaha nahi
    } catch (error) {
      toast.error("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return <Loader message="Checking authentication..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff6ec4] via-[#7873f5] to-[#4ADEDE] relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

      <div className="relative z-10 container mx-auto px-6 min-h-screen grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <div className="space-y-10 text-center lg:text-left animate-fade-in">
          <div className="flex justify-center lg:justify-start">
            <div className="p-6 bg-white/15 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl">
              <Heart className="h-16 w-16 text-white fill-white" />
            </div>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight">
            Find Your{" "}
            <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
              Perfect Match
            </span>
          </h1>

          <p className="text-xl text-white/90 max-w-xl mx-auto lg:mx-0">
            Real connections. Verified people. Start your love journey today.
          </p>

          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
            {STATS_DATA.map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-white">{stat.label}</p>
                <p className="text-white/70 text-sm">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center lg:justify-end animate-slide-up">
          <Card className="w-full max-w-md bg-white/15 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto p-5 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl shadow-lg">
                <Sparkles className="h-10 w-10 text-white" />
              </div>

              <CardTitle className="text-3xl font-bold text-white">
                Join Now
              </CardTitle>

              <CardDescription className="text-white/80">
                Takes less than 10 seconds 🚀
              </CardDescription>

              <div className="flex justify-center gap-6 text-white/90 pt-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  Instant
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-300" />
                  Secure
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-10">
              <Button
                onClick={handleGoogleSignIn}
                disabled={loading}
                size="lg"
                className="w-full bg-white text-gray-900 font-semibold shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
              >
                {loading ? "Signing you in..." : "Continue with Google"}
              </Button>

              <p className="text-center text-white/60 text-sm mt-6">
                By continuing, you agree to our Terms & Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
