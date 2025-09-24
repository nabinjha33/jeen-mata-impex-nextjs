/**
 * WhatsApp Integration Service
 * 
 * This service handles WhatsApp message sending through various providers
 * Currently supports: Twilio, WhatsApp Business API, and custom webhook endpoints
 * 
 * @author Jeen Mata Impex Development Team
 */

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
}

interface WhatsAppBusinessConfig {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
}

interface CustomWebhookConfig {
  endpoint: string;
  apiKey: string;
}

interface WhatsAppConfig {
  enabled: boolean;
  provider: 'twilio' | 'whatsapp-business' | 'custom-webhook';
  twilio: TwilioConfig;
  whatsappBusiness: WhatsAppBusinessConfig;
  customWebhook: CustomWebhookConfig;
}

interface ApplicationData {
  business_name?: string;
  businessName?: string;
  contact_person?: string;
  contactPerson?: string;
  phone: string;
  whatsapp?: string;
  business_type?: string;
  businessType?: string;
  vat_pan?: string;
  vatPan?: string;
  address: string;
  email: string;
  application_message?: string;
  message?: string;
}

interface InquiryData {
  inquiry_id: string;
  dealer_email: string;
  total_items: number;
  total_quantity: number;
  product_items: Array<{
    product_name: string;
    variant_details: string;
    quantity: number;
    notes?: string;
  }>;
}

interface OrderData {
  order_number: string;
  total_amount_npr?: number;
  status: string;
  product_items?: Array<{
    quantity: number;
    unit_price_npr?: number;
  }>;
  delivery_address: string;
}

interface WhatsAppResponse {
  success: boolean;
  data?: any;
  error?: string;
  reason?: string;
}

class WhatsAppService {
  private config: WhatsAppConfig;

  constructor() {
    this.config = {
      // Enable/disable WhatsApp notifications globally
      enabled: false, // Set to true when you have API credentials
      
      // Provider selection: 'twilio', 'whatsapp-business', 'custom-webhook'
      provider: 'twilio',
      
      // Provider-specific configurations
      // IMPORTANT: Replace these placeholder values with your actual credentials
      twilio: {
        accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your Twilio Account SID
        authToken: 'your_auth_token_here', // Replace with your Twilio Auth Token
        whatsappNumber: 'whatsapp:+14155238886', // Replace with your Twilio WhatsApp number
      },
      
      whatsappBusiness: {
        accessToken: 'your_access_token_here', // Replace with your WhatsApp Business access token
        phoneNumberId: 'your_phone_number_id_here', // Replace with your phone number ID
        businessAccountId: 'your_business_account_id_here', // Replace with your business account ID
      },
      
      customWebhook: {
        endpoint: 'https://your-api.com/send-whatsapp', // Replace with your webhook URL
        apiKey: 'your_api_key_here', // Replace with your API key
      }
    };
  }

  /**
   * Check if WhatsApp service is properly configured
   */
  isConfigured(): boolean {
    if (!this.config.enabled) return false;
    
    switch (this.config.provider) {
      case 'twilio':
        return !!(this.config.twilio.accountSid && 
                 this.config.twilio.authToken && 
                 this.config.twilio.whatsappNumber &&
                 this.config.twilio.accountSid !== 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' &&
                 this.config.twilio.authToken !== 'your_auth_token_here');
      case 'whatsapp-business':
        return !!(this.config.whatsappBusiness.accessToken && 
                 this.config.whatsappBusiness.phoneNumberId &&
                 this.config.whatsappBusiness.accessToken !== 'your_access_token_here');
      case 'custom-webhook':
        return !!(this.config.customWebhook.endpoint &&
                 this.config.customWebhook.endpoint !== 'https://your-api.com/send-whatsapp');
      default:
        return false;
    }
  }

  /**
   * Format phone number for WhatsApp (remove spaces, add country code if needed)
   */
  formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return '';
    
    // Remove all non-numeric characters except +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // If doesn't start with +, add +977 (Nepal country code)
    if (!cleaned.startsWith('+')) {
      cleaned = '+977' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Send WhatsApp message via Twilio
   */
  private async sendViaTwilio(to: string, message: string): Promise<any> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.config.twilio.accountSid}/Messages.json`;
    
    const payload = new URLSearchParams({
      From: this.config.twilio.whatsappNumber,
      To: `whatsapp:${this.formatPhoneNumber(to)}`,
      Body: message
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(this.config.twilio.accountSid + ':' + this.config.twilio.authToken)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Twilio WhatsApp Error: ${result.message || 'Unknown error'}`);
    }
    
    return result;
  }

  /**
   * Send WhatsApp message via WhatsApp Business API
   */
  private async sendViaWhatsAppBusiness(to: string, message: string): Promise<any> {
    const url = `https://graph.facebook.com/v18.0/${this.config.whatsappBusiness.phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: "whatsapp",
      to: this.formatPhoneNumber(to).replace('+', ''),
      type: "text",
      text: {
        body: message
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.whatsappBusiness.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`WhatsApp Business API Error: ${result.error?.message || 'Unknown error'}`);
    }
    
    return result;
  }

  /**
   * Send WhatsApp message via custom webhook
   */
  private async sendViaCustomWebhook(to: string, message: string): Promise<any> {
    const payload = {
      phone: this.formatPhoneNumber(to),
      message: message,
      apiKey: this.config.customWebhook.apiKey
    };

    const response = await fetch(this.config.customWebhook.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.customWebhook.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Custom WhatsApp Webhook Error: ${result.message || 'Unknown error'}`);
    }
    
    return result;
  }

  /**
   * Send WhatsApp message using configured provider
   */
  async sendMessage(to: string, message: string): Promise<WhatsAppResponse> {
    if (!this.isConfigured()) {
      console.warn('WhatsApp service is not configured. Message not sent.');
      console.warn('To enable WhatsApp notifications, update the credentials in components/services/WhatsAppService.ts');
      return { success: false, reason: 'Service not configured' };
    }

    try {
      let result: any;
      
      switch (this.config.provider) {
        case 'twilio':
          result = await this.sendViaTwilio(to, message);
          break;
        case 'whatsapp-business':
          result = await this.sendViaWhatsAppBusiness(to, message);
          break;
        case 'custom-webhook':
          result = await this.sendViaCustomWebhook(to, message);
          break;
        default:
          throw new Error(`Unsupported WhatsApp provider: ${this.config.provider}`);
      }

      console.log(`✅ WhatsApp message sent to ${to} via ${this.config.provider}:`, result);
      return { success: true, data: result };
      
    } catch (error: any) {
      console.error(`❌ Failed to send WhatsApp message to ${to}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send template message for new dealer application
   */
  async sendNewApplicationNotification(ownerPhone: string, applicationData: ApplicationData): Promise<WhatsAppResponse> {
    const message = `🆕 *New Dealer Application - Jeen Mata Impex*

📋 *Application Details:*
• *Business:* ${applicationData.business_name || applicationData.businessName}
• *Contact:* ${applicationData.contact_person || applicationData.contactPerson}
• *Email:* ${applicationData.email}
• *Phone:* ${applicationData.phone}
• *WhatsApp:* ${applicationData.whatsapp || applicationData.phone}
• *Business Type:* ${applicationData.business_type || applicationData.businessType}
• *VAT/PAN:* ${applicationData.vat_pan || applicationData.vatPan}
• *Address:* ${applicationData.address}

${(applicationData.application_message || applicationData.message) ? `💬 *Message:*\n"${applicationData.application_message || applicationData.message}"\n\n` : ''}🚀 *Action Required:* Login to admin panel → Dealer Management → Review application

📅 *Submitted:* ${new Date().toLocaleString()}

_This notification was sent from your Jeen Mata Impex dealer portal._`;

    return await this.sendMessage(ownerPhone, message);
  }

  /**
   * Send welcome message to approved dealer
   */
  async sendDealerWelcomeMessage(dealerPhone: string, applicationData: ApplicationData): Promise<WhatsAppResponse> {
    const contactPerson = applicationData.contact_person || applicationData.contactPerson;
    const businessName = applicationData.business_name || applicationData.businessName;
    
    const message = `🎉 *Congratulations ${contactPerson}!*

Your dealer application with *Jeen Mata Impex* has been *APPROVED* ✅

🏢 *Your Business:* ${businessName}

🔑 *Next Steps:*
1. Click this link to create your account: [Dealer Portal Link]
2. Sign in with Google using: ${applicationData.email}
3. Complete your dealer profile setup
4. Start browsing our premium product catalog!

🎁 *What You Get:*
• Wholesale pricing on all products
• Direct import from China & India
• Real-time shipment tracking
• Dedicated account manager
• 24/7 priority support

❓ *Need Help?*
📧 Email: jeenmataimpex8@gmail.com
📱 WhatsApp: +977-XXXXXXXXX

Welcome to the family! 🚢

_The Jeen Mata Impex Team_`;

    return await this.sendMessage(dealerPhone, message);
  }

  /**
   * Send template message for new inquiry notification
   */
  async sendNewInquiryNotification(ownerPhone: string, inquiryData: InquiryData): Promise<WhatsAppResponse> {
    const productsList = inquiryData.product_items.slice(0, 5).map((item, index) => 
      `${index + 1}. *${item.product_name}* (${item.variant_details}) - Qty: ${item.quantity}${item.notes ? `\n   _Note: ${item.notes}_` : ''}`
    ).join('\n');

    const additionalItems = inquiryData.product_items.length > 5 ? `\n...and ${inquiryData.product_items.length - 5} more items` : '';

    const message = `🔍 *New Product Inquiry - Jeen Mata Impex*

📧 *From Dealer:* ${inquiryData.dealer_email}
🆔 *Inquiry ID:* ${inquiryData.inquiry_id}
📦 *Total Items:* ${inquiryData.total_items}
📊 *Total Quantity:* ${inquiryData.total_quantity}

📋 *Requested Products:*
${productsList}${additionalItems}

🚀 *Action Required:* Login to admin panel → Inquiries → Review and respond with pricing quote

⏰ *Recommended Response Time:* Within 24 hours
📅 *Submitted:* ${new Date().toLocaleString()}

_This notification was sent from your Jeen Mata Impex dealer portal._`;

    return await this.sendMessage(ownerPhone, message);
  }

  /**
   * Send order confirmation to dealer
   */
  async sendOrderConfirmation(dealerPhone: string, orderData: OrderData): Promise<WhatsAppResponse> {
    const message = `✅ *Order Confirmed - Jeen Mata Impex*

📦 *Order #:* ${orderData.order_number}
💰 *Total Amount:* NPR ${orderData.total_amount_npr?.toLocaleString()}
🎯 *Status:* ${orderData.status}

📋 *Items Ordered:*
${orderData.product_items?.map(item => `• ${item.quantity}x Product (NPR ${item.unit_price_npr?.toLocaleString()})`).join('\n') || 'Details in dealer portal'}

🚚 *Delivery Address:*
${orderData.delivery_address}

📱 Track your order in the dealer portal or contact us for updates.

📧 jeenmataimpex8@gmail.com
📞 +977-XXXXXXXXX

Thank you for your business! 🙏`;

    return await this.sendMessage(dealerPhone, message);
  }
}

// Create singleton instance
const whatsAppService = new WhatsAppService();

export default whatsAppService;
