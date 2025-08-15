# Context System for E-commerce Application

This folder contains React Context providers for managing application state, user authentication, and shopping cart functionality.

## 🏗️ **Architecture Overview**

```
AppProvider (Root)
├── UserProvider (Authentication & User Management)
└── StateProvider (Cart & Wishlist Management)
```

## 📁 **Files Structure**

- **`user-context.ts`** - User authentication and profile management
- **`state-context.tsx`** - Shopping cart and wishlist state management
- **`app-provider.tsx`** - Combined provider wrapper
- **`README.md`** - This documentation

## 🚀 **Quick Start**

### 1. **Wrap Your App**

In your root layout or app component:

```tsx
import { AppProvider } from "@/contexts/app-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            {children}
        </AppProvider>
    )
}
```

### 2. **Use Contexts in Components**

```tsx
import { useUser } from "@/contexts/user-context"
import { useStateContext } from "@/contexts/state-context"

function MyComponent() {
    const { user, login, logout } = useUser()
    const { addToCart, cartItemCount } = useStateContext()
    
    // Your component logic here
}
```

## 👤 **User Context (`useUser`)**

### **Features:**
- ✅ User authentication state
- ✅ Login/logout functionality
- ✅ User profile management
- ✅ Role-based access control
- ✅ Local storage persistence
- ✅ Cross-tab synchronization

### **Available Methods:**

```tsx
const {
    user,           // Current user object or null
    loading,        // Loading state
    isAuthenticated, // Boolean authentication status
    login,          // Login function
    logout,         // Logout function
    updateUser,     // Update user profile
    hasRole         // Check user roles
} = useUser()
```

### **Usage Examples:**

```tsx
// Login
const { login } = useUser()
await login({
    id: "user123",
    name: "John Doe",
    email: "john@example.com",
    roles: ["customer"]
})

// Check roles
const { hasRole } = useUser()
if (hasRole(["admin", "manager"])) {
    // Show admin features
}

// Update profile
const { updateUser } = useUser()
updateUser({ name: "Jane Doe" })
```

## 🛒 **State Context (`useStateContext`)**

### **Features:**
- ✅ Shopping cart management
- ✅ Wishlist functionality
- ✅ Local storage persistence
- ✅ Automatic price calculations
- ✅ Quantity management
- ✅ Discount handling

### **Available Methods:**

```tsx
const {
    // Cart
    cart,              // Array of cart items
    cartTotal,         // Total cart value
    cartItemCount,     // Total number of items
    addToCart,         // Add product to cart
    removeFromCart,    // Remove product from cart
    updateCartQuantity, // Update product quantity
    clearCart,         // Clear entire cart
    
    // Wishlist
    wishlist,          // Array of wishlist items
    wishlistCount,     // Number of wishlist items
    addToWishlist,     // Add to wishlist
    removeFromWishlist, // Remove from wishlist
    isInWishlist,      // Check if product is in wishlist
    clearWishlist      // Clear wishlist
} = useStateContext()
```

### **Usage Examples:**

```tsx
// Add to cart
const { addToCart } = useStateContext()
addToCart(product, 2) // Add 2 of the same product

// Check wishlist status
const { isInWishlist, addToWishlist, removeFromWishlist } = useStateContext()
const isWishlisted = isInWishlist(product._id)

// Toggle wishlist
if (isWishlisted) {
    removeFromWishlist(product._id)
} else {
    addToWishlist(product)
}

// Update cart quantity
const { updateCartQuantity } = useStateContext()
updateCartQuantity(product._id, 5)
```

## 🔐 **User Types & Interfaces**

### **User Object:**
```tsx
type User = {
    id: string
    name: string
    email: string
    avatar?: string
    roles?: Role[]
}
```

### **Role Types:**
```tsx
type Role = "admin" | "manager" | "customer"
```

### **Cart Item:**
```tsx
type CartItem = {
    product: ProductType
    quantity: number
}
```

## 💾 **Storage Keys**

- **User Data:** `ecobazaar:user`
- **Cart Data:** `ecobazaar:cart`
- **Wishlist Data:** `ecobazaar:wishlist`

## 🎯 **Best Practices**

### **1. Always Use Contexts Within Providers**
```tsx
// ❌ Wrong - Will throw error
function Component() {
    const { user } = useUser() // Error!
}

// ✅ Correct - Wrap with provider
<AppProvider>
    <Component />
</AppProvider>
```

### **2. Handle Loading States**
```tsx
function Component() {
    const { user, loading } = useUser()
    
    if (loading) return <div>Loading...</div>
    if (!user) return <div>Please login</div>
    
    return <div>Welcome, {user.name}!</div>
}
```

### **3. Use Callbacks for Performance**
```tsx
const { addToCart } = useStateContext()

// ✅ Good - Memoized callback
const handleAddToCart = useCallback(() => {
    addToCart(product)
}, [addToCart, product])

// ❌ Bad - Creates new function on every render
const handleAddToCart = () => addToCart(product)
```

## 🔧 **Customization**

### **Extending User Context:**
```tsx
// Add new user fields
type User = {
    id: string
    name: string
    email: string
    phone?: string        // New field
    preferences?: object  // New field
}
```

### **Adding New Cart Features:**
```tsx
// Add save for later functionality
const saveForLater = useCallback((productId: string) => {
    // Implementation
}, [])
```

## 🚨 **Error Handling**

All contexts include proper error handling:
- **Storage errors** are logged and cleared
- **Invalid data** is automatically removed
- **Type safety** is enforced with TypeScript

## 📱 **Cross-Tab Synchronization**

User context automatically syncs across browser tabs:
- Login/logout in one tab updates all tabs
- Profile changes are reflected everywhere
- No manual refresh needed

## 🔒 **Security Notes**

- **Local storage** is used for persistence
- **No sensitive data** should be stored in contexts
- **API calls** should be made in separate services
- **JWT tokens** should be handled securely

## 🎉 **Ready to Use!**

Your context system is now fully set up and ready to power your e-commerce application with:
- ✅ User authentication
- ✅ Shopping cart
- ✅ Wishlist functionality
- ✅ Persistent state
- ✅ Type safety
- ✅ Performance optimization

Happy coding! 🚀
