# Zoho CRM Integration Setup Guide

This guide will help you deploy the Zoho CRM integration for your MRM Advocates website on Netlify.

---

## 📋 What This Integration Does

When visitors submit the contact form on your website, the integration will:
1. ✅ Validate all form fields
2. ✅ Send the data to your Netlify serverless function
3. ✅ Automatically create a new Lead in your Zoho CRM
4. ✅ Map all form fields to appropriate Zoho CRM fields
5. ✅ Show success/error messages to the user

---

## 🔑 Your Zoho CRM Credentials

**Client ID:** `1000.TNS9X8V22TVZU19ME69HDTMDH98B0A`  
**Client Secret:** `4a9eb7e361b3f673ef9bf0e5d514fa5f431a5cdcc4`  
**Refresh Token:** `1000.f51db0206cafaddb2b05e0a30bc1ccdd.935e0c5c3d0377d2685c1186f33491da`  
**Data Center:** US (.com)

---

## 🚀 Deployment Steps

### Step 1: Push Code to GitHub

1. Open your terminal in the project directory
2. Run these commands:

```bash
cd /path/to/Mrm-_advoc

# Add all files
git add -A

# Commit changes
git commit -m "Add Zoho CRM integration with Netlify functions"

# Push to GitHub
git push origin main
```

### Step 2: Configure Environment Variables in Netlify

1. **Log in to Netlify** (https://app.netlify.com/)
2. **Go to your site** (mrm-advocates)
3. **Click on "Site settings"**
4. **Navigate to:** Build & deploy → Environment → Environment variables
5. **Add the following environment variables:**

| Variable Name | Value |
|--------------|-------|
| `ZOHO_CLIENT_ID` | `1000.TNS9X8V22TVZU19ME69HDTMDH98B0A` |
| `ZOHO_CLIENT_SECRET` | `4a9eb7e361b3f673ef9bf0e5d514fa5f431a5cdcc4` |
| `ZOHO_REFRESH_TOKEN` | `1000.f51db0206cafaddb2b05e0a30bc1ccdd.935e0c5c3d0377d2685c1186f33491da` |

6. **Click "Save"** after adding each variable

### Step 3: Trigger a New Deploy

After adding environment variables:
1. Go to **Deploys** tab in Netlify
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for the deployment to complete (usually 1-2 minutes)

---

## ✅ Testing the Integration

### Test 1: Submit a Test Form

1. Go to your website: https://mrm-advocates.netlify.app/contact.html
2. Fill out the contact form with test data
3. Click "Send Message"
4. You should see a success message

### Test 2: Verify in Zoho CRM

1. Log in to your Zoho CRM account
2. Go to **Leads** module
3. You should see a new lead with:
   - First Name and Last Name
   - Email address
   - Phone number (if provided)
   - Company name (if provided)
   - Lead Source: "Website"
   - Description containing all form details

---

## 📊 Form Field Mapping

| Website Form Field | Zoho CRM Field | Notes |
|-------------------|----------------|-------|
| First Name | `First_Name` | Required |
| Last Name | `Last_Name` | Required |
| Email | `Email` | Required, validated |
| Phone | `Phone` | Optional |
| Company/Organization | `Company` | Optional, defaults to "N/A" |
| Service Needed | `Description` | Included in description |
| Urgency Level | `Description` | Included in description |
| Subject | `Description` | Included in description |
| Message | `Description` | Main message content |
| Newsletter Subscription | `Description` | Yes/No indicator |
| Lead Source | `Lead_Source` | Always set to "Website" |

---

## 🔧 Troubleshooting

### Issue: Form submission fails

**Solution:**
1. Check that all environment variables are correctly set in Netlify
2. Verify the Refresh Token hasn't expired (regenerate if needed)
3. Check Netlify Function logs: Site settings → Functions → View logs

### Issue: Leads not appearing in Zoho CRM

**Solution:**
1. Verify you're looking in the **Leads** module (not Contacts)
2. Check if your Zoho CRM user has permission to create leads
3. Review the Netlify function logs for error messages

### Issue: "Access token expired" error

**Solution:**
1. The refresh token automatically generates new access tokens
2. If this persists, regenerate the refresh token from Zoho API Console
3. Update the `ZOHO_REFRESH_TOKEN` environment variable in Netlify

---

## 🔐 Security Notes

- ✅ All API credentials are stored as environment variables (not in code)
- ✅ Environment variables are encrypted by Netlify
- ✅ The serverless function runs on Netlify's secure infrastructure
- ✅ CORS is properly configured to only accept requests from your domain
- ⚠️ Never commit `.env` files to GitHub
- ⚠️ Keep your API credentials confidential

---

## 📁 Files Added/Modified

### New Files:
- `netlify/functions/submit-to-zoho.js` - Serverless function for Zoho CRM integration
- `netlify.toml` - Netlify configuration
- `.env.example` - Environment variable template
- `ZOHO_CRM_SETUP.md` - This documentation file

### Modified Files:
- `js/main.js` - Updated contact form to use Netlify function
- `contact.html` - No changes (form structure remains the same)

---

## 🆘 Need Help?

If you encounter any issues:

1. **Check Netlify Function Logs:**
   - Netlify Dashboard → Functions → submit-to-zoho → View logs

2. **Check Browser Console:**
   - Right-click on page → Inspect → Console tab
   - Look for error messages when submitting the form

3. **Test the Function Directly:**
   ```bash
   curl -X POST https://mrm-advocates.netlify.app/.netlify/functions/submit-to-zoho \
     -H "Content-Type: application/json" \
     -d '{"firstName":"Test","lastName":"User","email":"test@example.com","service":"corporate","subject":"Test","message":"Testing integration"}'
   ```

---

## 🎉 Success!

Once deployed, every form submission on your website will automatically create a lead in your Zoho CRM, allowing you to:
- Track all inquiries in one place
- Follow up with potential clients
- Analyze lead sources and conversion rates
- Automate your sales workflow

**Your integration is ready to go live!** 🚀

