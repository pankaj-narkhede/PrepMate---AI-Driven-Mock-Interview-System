const Footer = () => {
  return (
    <footer className="border-t bg-background/70 backdrop-blur-sm py-6">
      <div className="text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-foreground">
          <span className="text-primary">Prep</span>Mate
        </span>{" "}
        — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
