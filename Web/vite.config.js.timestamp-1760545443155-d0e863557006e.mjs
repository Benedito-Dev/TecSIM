// vite.config.js
import { defineConfig } from "file:///C:/Users/Benedito/Documents/Visual%20Studio%20Code/TecSim/Web/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Benedito/Documents/Visual%20Studio%20Code/TecSim/Web/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///C:/Users/Benedito/Documents/Visual%20Studio%20Code/TecSim/Web/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///C:/Users/Benedito/Documents/Visual%20Studio%20Code/TecSim/Web/node_modules/autoprefixer/lib/autoprefixer.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        // Adiciona o Tailwind CSS
        autoprefixer()
        // Adiciona o Autoprefixer
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxCZW5lZGl0b1xcXFxEb2N1bWVudHNcXFxcVmlzdWFsIFN0dWRpbyBDb2RlXFxcXFRlY1NpbVxcXFxXZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEJlbmVkaXRvXFxcXERvY3VtZW50c1xcXFxWaXN1YWwgU3R1ZGlvIENvZGVcXFxcVGVjU2ltXFxcXFdlYlxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQmVuZWRpdG8vRG9jdW1lbnRzL1Zpc3VhbCUyMFN0dWRpbyUyMENvZGUvVGVjU2ltL1dlYi92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAndGFpbHdpbmRjc3MnO1xyXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICBjc3M6IHtcclxuICAgIHBvc3Rjc3M6IHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIHRhaWx3aW5kY3NzKCksIC8vIEFkaWNpb25hIG8gVGFpbHdpbmQgQ1NTXHJcbiAgICAgICAgYXV0b3ByZWZpeGVyKCksIC8vIEFkaWNpb25hIG8gQXV0b3ByZWZpeGVyXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1csU0FBUyxvQkFBb0I7QUFDNVksT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCO0FBRXpCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTO0FBQUEsUUFDUCxZQUFZO0FBQUE7QUFBQSxRQUNaLGFBQWE7QUFBQTtBQUFBLE1BQ2Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
