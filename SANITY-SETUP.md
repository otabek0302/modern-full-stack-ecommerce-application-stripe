# 🔧 **Sanity Permissions Fix Guide**

## 🚨 **Current Issue**
You're getting permission errors when trying to update user documents:
```
Insufficient permissions; permission "update" required
Insufficient permissions; permission "create" required
```

## 🔍 **Root Cause**
The issue is that your Sanity token doesn't have the right permissions to update published documents. This commonly happens when:
1. **Token permissions are too restrictive**
2. **Documents are published and need draft workflow**
3. **Content lifecycle settings are misconfigured**

## 🛠️ **Solution Steps**

### **Step 1: Check Your Environment Variables**

Make sure you have these in your `.env.local`:

```bash
# Sanity Project Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01

# Sanity Token with Write Permissions
SANITY_DEVELOPMENT_TOKEN=sk... # This needs write permissions
```

### **Step 2: Create a Proper Sanity Token**

1. **Go to [manage.sanity.io](https://manage.sanity.io)**
2. **Select your project**
3. **Go to API section**
4. **Create a new token with these permissions:**
   - ✅ **Read** - Read documents
   - ✅ **Write** - Create, update, delete documents
   - ✅ **Create** - Create new documents
   - ✅ **Update** - Update existing documents
   - ✅ **Delete** - Delete documents

### **Step 3: Update Your Sanity Client Configuration**

Your current configuration in `src/sanity/lib/server-client.ts`:

```typescript
export const serverClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token: process.env.SANITY_DEVELOPMENT_TOKEN,
    useCdn: false,
    perspective: "raw", // This allows working with drafts
});
```

### **Step 4: Alternative Approach - Use Draft Workflow**

If you still have permission issues, you can enable draft workflow in your Sanity Studio:

1. **In your Sanity Studio, go to `sanity.config.ts`**
2. **Add this configuration:**

```typescript
export default defineConfig({
  // ... other config
  document: {
    // Enable drafts for all document types
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((templateItem) => templateItem.schemaType === 'user')
      }
      return prev
    },
  },
})
```

### **Step 5: Test Permissions**

Use the test route I created: `/api/test-permissions`

This will tell you exactly what permissions your token has.

## 🔄 **How the Updated API Routes Work**

### **Profile Update Route (`/api/account/update`)**
1. **Tries direct update first** - Uses `patch()` method
2. **If that fails** - Falls back to delete + create approach
3. **Handles avatar uploads** - Uses Sanity's asset API

### **Password Change Route (`/api/account/change-password`)**
1. **Verifies current password** - Uses bcrypt comparison
2. **Updates password** - Same fallback approach as profile update
3. **Maintains security** - Proper password hashing

## 🧪 **Testing Your Setup**

1. **Check token permissions:**
   ```bash
   curl http://localhost:3000/api/test-permissions
   ```

2. **Try updating a profile:**
   - Go to your settings page
   - Make a small change (like phone number)
   - Click "Save Changes"

3. **Check console logs:**
   - Look for any permission errors
   - Verify the fallback approach works

## 🚀 **Expected Results**

After fixing permissions, you should see:
- ✅ **Profile updates work** - No permission errors
- ✅ **Avatar uploads work** - Images are stored in Sanity
- ✅ **Password changes work** - Secure password updates
- ✅ **Real-time updates** - Changes reflect immediately in UI

## 🔧 **If You Still Have Issues**

1. **Check Sanity project settings** - Ensure drafts are enabled
2. **Verify token scope** - Make sure it's not restricted to specific datasets
3. **Test with a fresh token** - Sometimes tokens get corrupted
4. **Check dataset permissions** - Ensure your dataset allows writes

## 📞 **Need Help?**

If you're still having issues:
1. **Check the test route output** - It will show exact permission status
2. **Verify your token in Sanity Studio** - Try creating a test document
3. **Check Sanity project logs** - Look for any API errors

---

**The key is having a token with proper write permissions and using the right perspective in your client configuration.**
