import { Footer } from "@/components/footer";
import { GradientText } from "@/components/gradient-text";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { NavBar } from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import { APP_CONSTANTS, howItWorks } from "@/lib/constant";
import React from "react";

const Page = () => {
  return (
    <div className="max-w-6xl mx-auto p-3 w-full">
      <NavBar />

      <div className="mt-3">
        <header>
          <h2 className="text-center font-bold">
            HOW{" "}
            <GradientText to="text-primary/50">
              {APP_CONSTANTS.appName.toUpperCase()}
            </GradientText>{" "}
            WORKS
          </h2>
          <p className="text-6xl text-center max-w-5xl mx-auto">
            Bridging the gap, Empowering transactions
          </p>
        </header>
        <div className="mt-3 grid md:grid-cols-3 grid-cols-1 gap-3">
          {howItWorks.map((howItWork) => (
            <Card key={howItWork.id}>
              <CardContent>
                <GradientText
                  to="text-primary/10"
                  className="text-9xl font-bold"
                >
                  {howItWork.id}
                </GradientText>
                <CardTitle className="md:text-xl text-lg">
                  {howItWork.title}
                </CardTitle>
                <CardDescription>{howItWork.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="w-full flex items-center justify-center mt-4">
          <Button className="h-[3rem] rounded-2xl cursor-pointer">
            Get Started
          </Button>
        </div>
      </div>
      <Separator className="mt-8" />
      <Footer />
    </div>
  );
};

export default Page;
