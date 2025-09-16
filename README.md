![Ecobazar Screenshot](https://i.ibb.co/xx46P3j/Screenshot-2025-09-16-at-14-19-42.png)

<!--
Width and height styling is not natively supported in Markdown, but for best results in Markdown viewers, 
the image will display at full width. For custom height (400px), use HTML if supported.
-->
# 🛒 Ecobazar - Modern E-Commerce Application

A full-stack, modern e-commerce application built with Next.js 15, featuring a beautiful UI, responsive design, and integrated with Stripe for payments.

## ✨ Features

- **Modern Design**: Clean, professional UI with your brand color (#1B5FFE)
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Component Library**: Built with shadcn/ui components for consistency
- **Tailwind CSS v4**: Latest styling framework with custom color scheme
- **Sanity CMS**: Headless CMS for managing products, categories, and content
- **Stripe Integration**: Secure payment processing (ready for implementation)
- **TypeScript**: Full type safety throughout the application
- **Performance**: Built with Next.js 15 and Turbopack for fast development

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS v4, PostCSS
- **Components**: shadcn/ui, Radix UI primitives
- **CMS**: Sanity v4
- **Icons**: Lucide React
- **Package Manager**: pnpm
- **Development**: Turbopack, ESLint

## 📱 Screenshots

### Desktop View
- Professional header with search, cart, and navigation
- Hero section with call-to-action
- Feature cards highlighting benefits
- Comprehensive footer with newsletter signup

### Mobile View
- Responsive navigation with mobile menu
- Touch-friendly interface
- Optimized layouts for small screens

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd modern-full-stack-ecommerce-application-stripe
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Add your configuration:
   ```env
   # Sanity CMS
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
   SANITY_DEVELOPMENT_TOKEN=your_sanity_write_token
   
   # Stripe Payments
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_or_pk_live_your_key
   STRIPE_SECRET_KEY=sk_test_or_sk_live_your_key
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles & Tailwind config
│   ├── layout.tsx         # Root layout with header/footer
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components (header, footer)
├── lib/                   # Utility functions
└── sanity/                # Sanity CMS configuration
    ├── schemas/           # Content schemas
    └── lib/               # Sanity client & utilities
```

## 🎨 Customization

### Colors
The primary brand color `#1B5FFE` is integrated throughout the application:
- Primary buttons and links
- Hover states
- Focus rings
- Brand elements

### Components
All UI components are built with shadcn/ui and can be easily customized:
- Button variants
- Input styles
- Card layouts
- Navigation components

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🚀 Production Deployment

### Prerequisites
- [ ] Sanity CMS project set up with production dataset
- [ ] Stripe account activated with live payment processing
- [ ] Domain name ready for deployment
- [ ] All environment variables configured

### Vercel (Recommended)
1. **Prepare for production:**
   ```bash
   npm run build
   npm run lint
   ```

2. **Deploy to Vercel:**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

3. **Configure environment variables in Vercel dashboard:**
   - Go to your project settings → Environment Variables
   - Add all production environment variables
   - Ensure `NODE_ENV=production`

4. **Set up custom domain:**
   - Configure DNS records
   - Enable automatic SSL certificates
   - Set up redirects (www → non-www)

### Other Platforms
- **Netlify**: Configure build commands and environment variables
- **Railway**: Use Dockerfile for containerized deployment
- **DigitalOcean App Platform**: Connect GitHub and configure build settings
- **AWS Amplify**: Full-stack deployment with serverless functions

### Post-Deployment Checklist
- [ ] Test complete user registration and login flow
- [ ] Verify Stripe payments work with live keys
- [ ] Check all environment variables are correctly set
- [ ] Test order creation and email notifications
- [ ] Verify SSL certificate is working
- [ ] Set up monitoring and error tracking
- [ ] Test mobile responsiveness across devices

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler
```

### Adding New Components

```bash
# Add new shadcn/ui components
pnpm dlx shadcn@latest add [component-name]

# Examples
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add form
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Sanity CMS](https://www.sanity.io/docs)
- [Stripe Documentation](https://stripe.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with ❤️ using Next.js, Tailwind CSS, and shadcn/ui**
