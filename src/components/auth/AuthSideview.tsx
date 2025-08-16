import Image from 'next/image';
interface AuthSideviewProps {
  
}

export function AuthSideview({  }: AuthSideviewProps) {
  return (
    <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 ">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-primary/30 to-transparent blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-accent/30 to-transparent blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-primary/20 rounded-full animate-float" />
      <div className="absolute bottom-32 left-1/4 w-6 h-6 bg-accent/20 rotate-45 animate-float-delayed" />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-secondary/30 rounded-full animate-float-slow" />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-md">
        {/* Brand Logo with glow effect */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
          <div className="relative bg-gradient-to-br from-background to-background/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
            <Image
              src="/globe.svg"
              alt="Earth & Home Logo"
              className="w-24 h-24 mx-auto drop-shadow-lg"
              width={96}
              height={96}
            />
          </div>
        </div>

        {/* Brand text with gradient */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-br from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
            Earth & Home
          </h1>
          <p className="text-lg text-muted-foreground/80 leading-relaxed font-medium">
            Welcome back to your property discovery journey
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto" />
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground/50 whitespace-nowrap">
          Discover • Connect • Call Home
        </div>
      </div>
    </div>
  );
}
