const HeroText = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tight">
          <span className="text-foreground">Welcome</span>
          <br />
          <span className="text-primary">back.</span>
          <br />
          <span className="text-foreground">Your music is</span>
          <br />
          <span className="text-primary">waiting.</span>
        </h1>
      </div>
    </div>
  );
};

export default HeroText;
