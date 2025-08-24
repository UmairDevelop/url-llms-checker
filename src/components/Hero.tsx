import { LLMSValidator } from "./LLMSValidator";

export const Hero = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            LLMS.txt Validator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Check if websites have a valid LLMS.txt file for AI training data policies and content licensing
          </p>
        </div>

        <div className="animate-slide-up">
          <LLMSValidator />
        </div>
      </div>
    </section>
  );
};