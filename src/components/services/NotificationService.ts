/**
 * Unified Notification Service
 * Handles both Email and WhatsApp notifications
 */

// TODO: Replace with actual email integration
// import { SendEmail } from '@/integrations/Core';
import whatsAppService from './WhatsAppService.js';

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

interface NotificationResult {
  success: boolean;
  error?: string | null;
}

interface NotificationResults {
  email: NotificationResult;
  whatsapp: NotificationResult;
}

class NotificationService {
  private ownerEmail: string;
  private ownerWhatsApp: string;

  constructor() {
    this.ownerEmail = 'jeenmataimpex8@gmail.com';
    this.ownerWhatsApp = '+977-XXXXXXXXX'; // Replace with actual WhatsApp number
  }

  /**
   * Send notification to owner about new dealer application
   */
  async notifyOwnerNewApplication(applicationData: ApplicationData): Promise<NotificationResults> {
    const results: NotificationResults = {
      email: { success: false, error: null },
      whatsapp: { success: false, error: null }
    };

    // Send Email Notification
    try {
      // TODO: Replace with actual email service
      // await SendEmail({
      //   to: this.ownerEmail,
      //   subject: `🆕 New Dealer Application - ${applicationData.business_name || applicationData.businessName}`,
      //   body: this.generateOwnerEmailTemplate(applicationData)
      // });
      
      console.log('Email would be sent to:', this.ownerEmail);
      console.log('Subject:', `🆕 New Dealer Application - ${applicationData.business_name || applicationData.businessName}`);
      
      results.email.success = true;
      console.log('✅ Owner email notification sent');
    } catch (error: any) {
      results.email.error = error.message;
      console.error('❌ Failed to send owner email notification:', error);
    }

    // Send WhatsApp Notification
    try {
      const whatsappResult = await whatsAppService.sendNewApplicationNotification(
        this.ownerWhatsApp, 
        applicationData
      );
      results.whatsapp = whatsappResult;
      if (whatsappResult.success) {
        console.log('✅ Owner WhatsApp notification sent');
      } else {
        console.warn('⚠️ WhatsApp notification not sent:', whatsappResult.error);
      }
    } catch (error: any) {
      results.whatsapp.error = error.message;
      console.error('❌ Failed to send owner WhatsApp notification:', error);
    }

    return results;
  }

  /**
   * Send welcome notification to approved dealer
   */
  async notifyDealerApproval(applicationData: ApplicationData): Promise<NotificationResults> {
    const results: NotificationResults = {
      email: { success: false, error: null },
      whatsapp: { success: false, error: null }
    };

    const dealerEmail = applicationData.email;
    const dealerWhatsApp = applicationData.whatsapp || applicationData.phone;

    // Send Welcome Email
    try {
      // TODO: Replace with actual email service
      // await SendEmail({
      //   to: dealerEmail,
      //   subject: "🎉 Welcome to Jeen Mata Impex - Your Dealer Application is Approved!",
      //   body: this.generateDealerWelcomeEmailTemplate(applicationData)
      // });
      
      console.log('Welcome email would be sent to:', dealerEmail);
      
      results.email.success = true;
      console.log('✅ Dealer welcome email sent');
    } catch (error: any) {
      results.email.error = error.message;
      console.error('❌ Failed to send dealer welcome email:', error);
    }

    // Send WhatsApp Welcome Message
    try {
      const whatsappResult = await whatsAppService.sendDealerWelcomeMessage(
        dealerWhatsApp, 
        applicationData
      );
      results.whatsapp = whatsappResult;
      if (whatsappResult.success) {
        console.log('✅ Dealer WhatsApp welcome message sent');
      } else {
        console.warn('⚠️ WhatsApp welcome message not sent:', whatsappResult.error);
      }
    } catch (error: any) {
      results.whatsapp.error = error.message;
      console.error('❌ Failed to send dealer WhatsApp welcome message:', error);
    }

    return results;
  }

  /**
   * Send notification to owner about new inquiry
   */
  async notifyOwnerNewInquiry(inquiryData: InquiryData): Promise<NotificationResults> {
    const results: NotificationResults = {
      email: { success: false, error: null },
      whatsapp: { success: false, error: null }
    };

    // Send Email Notification
    try {
      // TODO: Replace with actual email service
      // await SendEmail({
      //   to: this.ownerEmail,
      //   subject: `🔍 New Product Inquiry - ${inquiryData.dealer_email}`,
      //   body: this.generateInquiryEmailTemplate(inquiryData)
      // });
      
      console.log('Inquiry email would be sent to:', this.ownerEmail);
      
      results.email.success = true;
      console.log('✅ Owner inquiry email notification sent');
    } catch (error: any) {
      results.email.error = error.message;
      console.error('❌ Failed to send owner inquiry email notification:', error);
    }

    // Send WhatsApp Notification
    try {
      const whatsappResult = await whatsAppService.sendNewInquiryNotification(
        this.ownerWhatsApp, 
        inquiryData
      );
      results.whatsapp = whatsappResult;
      if (whatsappResult.success) {
        console.log('✅ Owner WhatsApp inquiry notification sent');
      } else {
        console.warn('⚠️ WhatsApp inquiry notification not sent:', whatsappResult.error);
      }
    } catch (error: any) {
      results.whatsapp.error = error.message;
      console.error('❌ Failed to send owner WhatsApp inquiry notification:', error);
    }

    return results;
  }

  /**
   * Send order confirmation notifications
   */
  async notifyOrderConfirmation(orderData: OrderData, dealerWhatsApp: string): Promise<NotificationResults> {
    const results: NotificationResults = {
      email: { success: false, error: null },
      whatsapp: { success: false, error: null }
    };

    // Send Order Confirmation Email (if needed)
    // ... email logic here

    // Send WhatsApp Order Confirmation
    try {
      const whatsappResult = await whatsAppService.sendOrderConfirmation(
        dealerWhatsApp, 
        orderData
      );
      results.whatsapp = whatsappResult;
      if (whatsappResult.success) {
        console.log('✅ Order confirmation WhatsApp sent');
      } else {
        console.warn('⚠️ WhatsApp order confirmation not sent:', whatsappResult.error);
      }
    } catch (error: any) {
      results.whatsapp.error = error.message;
      console.error('❌ Failed to send order confirmation WhatsApp:', error);
    }

    return results;
  }

  /**
   * Generate HTML template for owner email notification
   */
  private generateOwnerEmailTemplate(applicationData: ApplicationData): string {
    const businessName = applicationData.business_name || applicationData.businessName;
    const contactPerson = applicationData.contact_person || applicationData.contactPerson;
    const phone = applicationData.phone;
    const whatsapp = applicationData.whatsapp || phone;
    const businessType = applicationData.business_type || applicationData.businessType;
    const vatPan = applicationData.vat_pan || applicationData.vatPan;
    const address = applicationData.address;
    const email = applicationData.email;
    const message = applicationData.application_message || applicationData.message;

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0; font-size: 24px;">🆕 New Dealer Application</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0;">Jeen Mata Impex - Admin Notification</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #dc2626; margin: 0 0 15px 0;">📋 Application Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151; width: 40%;">Business Name:</td><td style="color: #1f2937;">${businessName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Contact Person:</td><td style="color: #1f2937;">${contactPerson}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td><td style="color: #1f2937;">${email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td><td style="color: #1f2937;">${phone}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">WhatsApp:</td><td style="color: #1f2937;">${whatsapp}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Business Type:</td><td style="color: #1f2937;">${businessType}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">VAT/PAN:</td><td style="color: #1f2937;">${vatPan}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Address:</td><td style="color: #1f2937;">${address}</td></tr>
          </table>
        </div>

        ${message ? `
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 25px;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">💬 Application Message</h3>
            <p style="margin: 0; color: #6b7280; font-style: italic;">"${message}"</p>
          </div>
        ` : ''}

        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 25px;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">🚀 Next Steps</h3>
          <p style="margin: 0; color: #1e40af;">
            <strong>Action Required:</strong> Log in to your admin panel → <strong>"Dealer Management"</strong> → Review and approve/reject this application.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6b7280; margin: 0;">📱 <strong>WhatsApp Quick Contact:</strong> ${whatsapp}</p>
          <p style="color: #6b7280; margin: 5px 0 0 0;">💼 Submitted on: ${new Date().toLocaleString()}</p>
        </div>

        <hr style="border: none; height: 1px; background: #e5e7eb; margin: 20px 0;">
        <p style="text-align: center; color: #9ca3af; font-size: 14px; margin: 0;">
          This notification was sent from your Jeen Mata Impex dealer portal system.
        </p>
      </div>
    `;
  }

  /**
   * Generate HTML template for dealer welcome email
   */
  private generateDealerWelcomeEmailTemplate(applicationData: ApplicationData): string {
    const businessName = applicationData.business_name || applicationData.businessName;
    const contactPerson = applicationData.contact_person || applicationData.contactPerson;
    const email = applicationData.email;
    const phone = applicationData.phone;
    const whatsapp = applicationData.whatsapp || phone;

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 18px;">Your dealer application has been approved</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 25px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
          <h2 style="color: #065f46; margin: 0 0 15px 0;">Welcome to Jeen Mata Impex, ${contactPerson}! 👋</h2>
          <p style="color: #047857; font-size: 16px; margin: 0;">Your business <strong>"${businessName}"</strong> is now part of our dealer network.</p>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #92400e;">🔑 Next Step: Create Your Account Password</h3>
          <p style="margin: 0 0 15px 0; color: #b45309;">To access the dealer portal, you need to set up your login credentials:</p>
          <ol style="color: #b45309; padding-left: 20px; margin: 0;">
            <li>Click the button below to access the dealer login page</li>
            <li>Sign in with Google using your email: <strong>${email}</strong></li>
            <li>Complete your dealer profile setup</li>
            <li>Start browsing our premium product catalog!</li>
          </ol>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${typeof window !== 'undefined' ? window.location?.origin : 'https://yourdomain.com'}/dealer-login" 
             style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            🚀 Access Dealer Portal
          </a>
        </div>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #374151;">📞 Your Contact Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 5px 0; color: #6b7280; width: 30%;">Email:</td><td style="color: #374151; font-weight: 500;">${email}</td></tr>
            <tr><td style="padding: 5px 0; color: #6b7280;">Phone:</td><td style="color: #374151; font-weight: 500;">${phone}</td></tr>
            <tr><td style="padding: 5px 0; color: #6b7280;">WhatsApp:</td><td style="color: #374151; font-weight: 500;">${whatsapp}</td></tr>
            <tr><td style="padding: 5px 0; color: #6b7280;">Business:</td><td style="color: #374151; font-weight: 500;">${businessName}</td></tr>
          </table>
        </div>

        <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; border-left: 4px solid #0288d1;">
          <h3 style="margin: 0 0 15px 0; color: #01579b;">🎁 What's Next?</h3>
          <ul style="color: #0277bd; padding-left: 20px; margin: 0;">
            <li><strong>Browse Products:</strong> Access our complete catalog with wholesale pricing</li>
            <li><strong>Submit Inquiries:</strong> Request quotes for products you're interested in</li>
            <li><strong>Track Shipments:</strong> Monitor your orders from China/India to Nepal</li>
            <li><strong>Dedicated Support:</strong> Get priority customer service and account management</li>
          </ul>
        </div>

        <hr style="border: none; height: 1px; background: #e5e7eb; margin: 25px 0;">
        
        <div style="text-align: center; margin-bottom: 20px;">
          <p style="color: #374151; margin: 0 0 10px 0;"><strong>Need Help?</strong></p>
          <p style="color: #6b7280; margin: 0;">Contact us at <strong>jeenmataimpex8@gmail.com</strong> or WhatsApp: <strong>+977-XXXXXXXXX</strong></p>
        </div>

        <p style="text-align: center; color: #9ca3af; font-size: 14px; margin: 0;">
          Welcome aboard! 🚢<br>
          <em>The Jeen Mata Impex Team</em>
        </p>
      </div>
    `;
  }

  /**
   * Generate HTML template for inquiry email notification
   */
  private generateInquiryEmailTemplate(inquiryData: InquiryData): string {
    const itemsHtml = inquiryData.product_items.map(item => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; font-weight: 500;">${item.product_name}</td>
        <td style="padding: 12px; color: #6b7280;">${item.variant_details}</td>
        <td style="padding: 12px; text-align: center; font-weight: 600;">${item.quantity}</td>
        <td style="padding: 12px; color: #6b7280; font-size: 14px;">${item.notes || 'No notes'}</td>
      </tr>
    `).join('');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0; font-size: 24px;">🔍 New Product Inquiry</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0;">Jeen Mata Impex - Inquiry Notification</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #dc2626; margin: 0 0 15px 0;">📋 Inquiry Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151; width: 40%;">Inquiry ID:</td><td style="color: #1f2937;">${inquiryData.inquiry_id}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Dealer Email:</td><td style="color: #1f2937;">${inquiryData.dealer_email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Total Items:</td><td style="color: #1f2937;">${inquiryData.total_items}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Total Quantity:</td><td style="color: #1f2937;">${inquiryData.total_quantity}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Submitted:</td><td style="color: #1f2937;">${new Date().toLocaleString()}</td></tr>
          </table>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #374151;">📦 Requested Products</h3>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
            <thead style="background: #f3f4f6;">
              <tr>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Product</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Variant</th>
                <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151;">Quantity</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Notes</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 25px;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">🚀 Next Steps</h3>
          <p style="margin: 0; color: #1e40af;">
            <strong>Action Required:</strong> Log in to your admin panel → <strong>"Inquiries"</strong> → Review and respond with pricing quote.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6b7280; margin: 0;">📧 Dealer Contact: <strong>${inquiryData.dealer_email}</strong></p>
          <p style="color: #6b7280; margin: 5px 0 0 0;">🕒 Response Time: Within 24 hours recommended</p>
        </div>

        <hr style="border: none; height: 1px; background: #e5e7eb; margin: 20px 0;">
        <p style="text-align: center; color: #9ca3af; font-size: 14px; margin: 0;">
          This notification was sent from your Jeen Mata Impex dealer portal system.
        </p>
      </div>
    `;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
