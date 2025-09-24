'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileText, CheckCircle, AlertCircle, Download, Eye, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Note: These integrations need to be implemented or replaced with appropriate API calls
// import { UploadFile, ExtractDataFromUploadedFile } from '@/integrations/Core';
// import { Product, Brand, Shipment } from '@/entities/all';

interface EntitySchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean';
    required: boolean;
    default?: any;
    enum?: string[];
    description?: string;
  };
}

interface ValidationResult {
  index: number;
  item: any;
  errors: string[];
  warnings: string[];
  valid: boolean;
}

interface BulkUploaderProps {
  entityType?: 'Product' | 'Brand' | 'Shipment';
  onUploadSuccess?: (count: number) => void;
}

const entitySchemas: Record<string, EntitySchema> = {
  Product: {
    name: { type: 'string', required: true },
    brand: { type: 'string', required: true },
    category: { type: 'string', required: true },
    slug: { type: 'string', required: false },
    description: { type: 'string', required: false },
    featured: { type: 'boolean', required: false, default: false },
    images: { type: 'string', required: false, description: 'Comma-separated image URLs' },
    size: { type: 'string', required: false },
    packaging: { type: 'string', required: false },
    estimated_price_npr: { type: 'number', required: false },
    stock_status: { type: 'string', required: true, enum: ["In Stock", "Low Stock", "Out of Stock", "Pre-Order"] }
  },
  Brand: {
    name: { type: 'string', required: true },
    slug: { type: 'string', required: false },
    description: { type: 'string', required: false },
    logo: { type: 'string', required: false },
    origin_country: { type: 'string', required: false },
    established_year: { type: 'string', required: false },
    specialty: { type: 'string', required: false },
    active: { type: 'boolean', required: false, default: true }
  },
  Shipment: {
    tracking_number: { type: 'string', required: true },
    origin_country: { type: 'string', required: true, enum: ['China', 'India'] },
    status: { type: 'string', required: true, enum: ["Booked", "In Transit", "At Port", "Customs", "In Warehouse"] },
    eta_date: { type: 'string', required: true, description: 'Format: YYYY-MM-DD' },
    product_names: { type: 'string', required: false, description: 'Comma-separated product names' },
    port_name: { type: 'string', required: false }
  }
};

const sampleData: Record<string, any[]> = {
  Product: [
    {
      name: "Heavy Duty Drill",
      brand: "FastDrill", 
      category: "Tools",
      description: "Professional grade drilling equipment",
      featured: false,
      images: "https://example.com/image1.jpg,https://example.com/image2.jpg",
      size: "13mm",
      packaging: "Box",
      estimated_price_npr: 5000,
      stock_status: "In Stock"
    },
    {
      name: "Heavy Duty Drill",
      brand: "FastDrill",
      category: "Tools",
      description: "Professional grade drilling equipment",
      featured: false,
      images: "https://example.com/image1.jpg,https://example.com/image2.jpg",
      size: "16mm",
      packaging: "Box",
      estimated_price_npr: 6500,
      stock_status: "Low Stock"
    },
    {
      name: "Industrial Hammer",
      brand: "Spider",
      category: "Tools", 
      description: "Heavy construction hammer",
      featured: true,
      images: "https://example.com/hammer.jpg",
      size: "Large",
      packaging: "Unit",
      estimated_price_npr: 1200,
      stock_status: "In Stock"
    }
  ],
  Brand: [
    {
      name: "NewBrand",
      description: "Innovative tool manufacturer",
      logo: "https://example.com/newbrand-logo.jpg",
      origin_country: "Germany",
      established_year: "2020",
      specialty: "Power Tools",
      active: true
    }
  ],
  Shipment: [
    {
      tracking_number: "JMI-12345-CN",
      origin_country: "China",
      status: "In Transit",
      eta_date: "2024-09-15",
      product_names: "Heavy Duty Drill,Industrial Hammer",
      port_name: "Kolkata"
    },
    {
      tracking_number: "JMI-67890-IN",
      origin_country: "India",
      status: "Booked",
      eta_date: "2024-09-10",
      product_names: "Gorkha Cement Mixer",
      port_name: "Birgunj"
    }
  ]
};

export default function BulkUploader({ entityType = "Product", onUploadSuccess }: BulkUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [uploadStep, setUploadStep] = useState<'upload' | 'preview' | 'complete'>('upload');
  const [importedCount, setImportedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingStatus, setProcessingStatus] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setExtractedData([]);
    setValidationResults([]);
    setUploadStep('upload');
    setErrorMessage('');
    setImportedCount(0);
    setProcessingStatus('');
  };

  // Simple CSV parser fallback
  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values: string[] = [];
      let currentValue = '';
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"' && (j === 0 || line[j-1] === ',')) {
          inQuotes = true;
        } else if (char === '"' && inQuotes && (j === line.length - 1 || line[j+1] === ',')) {
          inQuotes = false;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim());

      const row: any = {};
      headers.forEach((header, index) => {
        let value: any = values[index] || '';
        
        // Convert boolean values
        if (value.toLowerCase() === 'true') value = true;
        else if (value.toLowerCase() === 'false') value = false;
        
        // Convert numeric values for price fields
        if (header === 'estimated_price_npr' && value && !isNaN(parseFloat(value))) {
          value = parseFloat(value);
        }
        
        row[header] = value;
      });
      
      data.push(row);
    }

    return data;
  };

  const handleUpload = async () => {
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const validTypes = ['.csv', '.xlsx', '.xls', '.json'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(fileExtension)) {
      setErrorMessage('Please upload a CSV, Excel, or JSON file');
      return;
    }

    setIsUploading(true);
    setIsExtracting(true);
    setErrorMessage('');
    setProcessingStatus('Uploading file...');
    
    try {
      let extractedData: any[] = [];

      if (fileExtension === '.json') {
        // Handle JSON files locally
        setProcessingStatus('Reading JSON file...');
        const fileReader = new FileReader();
        
        extractedData = await new Promise<any[]>((resolve, reject) => {
          fileReader.onload = (event) => {
            try {
              const jsonData = JSON.parse(event.target?.result as string);
              const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
              resolve(dataArray);
            } catch (jsonError: any) {
              reject(new Error(`Invalid JSON format: ${jsonError.message}`));
            }
          };
          fileReader.onerror = () => reject(new Error('Failed to read file'));
          fileReader.readAsText(file);
        });
        
        setProcessingStatus('JSON file parsed successfully.');
      } else if (fileExtension === '.csv') {
        // Handle CSV files locally
        setProcessingStatus('Reading CSV file...');
        const fileReader = new FileReader();
        
        extractedData = await new Promise<any[]>((resolve, reject) => {
          fileReader.onload = (event) => {
            try {
              const csvText = event.target?.result as string;
              const parsedData = parseCSV(csvText);
              resolve(parsedData);
            } catch (csvError: any) {
              reject(new Error(`CSV parsing failed: ${csvError.message}`));
            }
          };
          fileReader.onerror = () => reject(new Error('Failed to read file'));
          fileReader.readAsText(file);
        });
        
        setProcessingStatus('CSV file parsed successfully.');
      } else {
        // For Excel files, you might want to implement a library like xlsx
        throw new Error('Excel file processing not implemented yet. Please use CSV or JSON files.');
      }

      if (extractedData.length === 0) {
        throw new Error('No data found in file. Please check the file format and content.');
      }

      console.log('Final extracted data:', extractedData);
      setExtractedData(extractedData);
      validateData(extractedData);
      setUploadStep('preview');
      setProcessingStatus('');

    } catch (error: any) {
      console.error('Upload failed:', error);
      setErrorMessage(`Failed to process file: ${error.message}`);
      setProcessingStatus('');
    } finally {
      setIsUploading(false);
      setIsExtracting(false);
    }
  };

  const validateData = (data: any[]) => {
    const results: ValidationResult[] = data.map((item, index) => {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      const schema = entitySchemas[entityType];

      Object.entries(schema).forEach(([field, config]) => {
        // Check for required fields
        if (config.required && (!item[field] || String(item[field]).trim() === '')) {
          errors.push(`Missing required field: ${field}`);
        }
        
        // Check for enum values
        if (config.enum && item[field] && !config.enum.includes(item[field])) {
          errors.push(`Invalid value for ${field}: '${item[field]}'. Must be one of: ${config.enum.join(', ')}`);
        }

        // Specific validation for estimated_price_npr
        if (field === 'estimated_price_npr' && item[field]) {
          const parsedPrice = parseFloat(item[field]);
          if (isNaN(parsedPrice) || parsedPrice < 0) {
            errors.push(`Invalid value for ${field}: '${item[field]}'. Must be a positive number.`);
          }
        }
        
        // Date validation for eta_date
        if (field === 'eta_date' && item[field]) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(item[field]) || isNaN(new Date(item[field]).getTime())) {
            errors.push(`Invalid date format for ${field}: '${item[field]}'. Must be YYYY-MM-DD.`);
          }
        }

        // Slug generation warning
        if (field === 'slug' && !item[field] && item.name) {
          warnings.push('Slug will be auto-generated from product name');
        }
      });

      return {
        index,
        item,
        errors,
        warnings,
        valid: errors.length === 0
      };
    });
    
    setValidationResults(results);
  };

  const handleImport = async () => {
    const validRows = validationResults
      .filter(result => result.valid)
      .map(result => result.item);

    if (validRows.length === 0) {
      alert('No valid items to import');
      return;
    }

    setIsImporting(true);
    setErrorMessage('');
    
    try {
      // Note: Replace these with actual API calls to your backend
      if (entityType === 'Product') {
        // Group rows by product name to create products with variants
        const groupedByProduct = validRows.reduce((acc: Record<string, any[]>, row: any) => {
          const key = row.name;
          if (!acc[key]) acc[key] = [];
          acc[key].push(row);
          return acc;
        }, {});
        
        const productsToCreate = Object.values(groupedByProduct).map((productRows: any[]) => {
          const firstRow = productRows[0];
          
          // Generate slug if not provided
          const productSlug = firstRow.slug || firstRow.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

          // Process images - convert comma-separated string to array
          let images: string[] = [];
          if (firstRow.images && firstRow.images.trim()) {
            images = firstRow.images.split(',').map((url: string) => url.trim()).filter((url: string) => url);
          }

          // Create product base from the first row
          const product = {
            name: firstRow.name,
            brand: firstRow.brand,
            category: firstRow.category,
            slug: productSlug,
            description: firstRow.description || '',
            featured: firstRow.featured || false,
            images: images,
            variants: productRows.map((row: any, index: number) => ({
              // Generate a unique ID for each variant
              id: `${productSlug}-${row.size || 'standard'}-${row.packaging || 'unit'}-${index}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              size: row.size || 'Standard',
              packaging: row.packaging || 'Unit',
              estimated_price_npr: parseFloat(row.estimated_price_npr) || 0,
              stock_status: row.stock_status || 'In Stock'
            }))
          };
          return product;
        });

        // TODO: Replace with actual API call
        // await Product.bulkCreate(productsToCreate);
        console.log('Products to create:', productsToCreate);
        setImportedCount(productsToCreate.length);
        onUploadSuccess?.(productsToCreate.length);

      } else if (entityType === 'Brand') {
        const brandsToCreate = validRows.map(item => {
          // Set defaults and auto-generate slug
          const brandItem = { ...item };
          if (!brandItem.slug && brandItem.name) {
            brandItem.slug = brandItem.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          }
          // Set default values
          Object.entries(entitySchemas[entityType]).forEach(([field, config]) => {
            if (config.default !== undefined && (!brandItem[field] || brandItem[field] === '')) {
              brandItem[field] = config.default;
            }
          });
          return brandItem;
        });
        
        // TODO: Replace with actual API call
        // await Brand.bulkCreate(brandsToCreate);
        console.log('Brands to create:', brandsToCreate);
        setImportedCount(brandsToCreate.length);
        onUploadSuccess?.(brandsToCreate.length);
      } else if (entityType === 'Shipment') {
        const shipmentsToCreate = validRows.map(item => {
          const shipmentItem = { ...item };
          // Convert comma-separated string to array
          if (shipmentItem.product_names && typeof shipmentItem.product_names === 'string') {
              shipmentItem.product_names = shipmentItem.product_names.split(',').map((name: string) => name.trim()).filter((name: string) => name);
          } else {
              shipmentItem.product_names = [];
          }
          // Set last_updated date
          shipmentItem.last_updated = new Date().toISOString();
          return shipmentItem;
        });
        
        // TODO: Replace with actual API call
        // await Shipment.bulkCreate(shipmentsToCreate);
        console.log('Shipments to create:', shipmentsToCreate);
        setImportedCount(shipmentsToCreate.length);
        onUploadSuccess?.(shipmentsToCreate.length);
      }
      
      setUploadStep('complete');
    } catch (error: any) {
      console.error('Import failed:', error);
      setErrorMessage(`Import failed: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const headers = Object.keys(entitySchemas[entityType]);
    const sampleRows = sampleData[entityType] || [];
    
    let csvContent = headers.join(',') + '\n';
    sampleRows.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Handle values that might contain commas or newlines by wrapping them in quotes
        let formattedValue = String(value);
        if (formattedValue.includes(',') || formattedValue.includes('\n') || formattedValue.includes('"')) {
          formattedValue = `"${formattedValue.replace(/"/g, '""')}"`;
        }
        return formattedValue;
      });
      csvContent += values.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${entityType}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const validCount = validationResults.filter(r => r.valid).length;
  const errorCount = validationResults.filter(r => !r.valid).length;
  const uniqueProductsCount = entityType === 'Product' ? 
    new Set(validationResults.filter(r => r.valid).map(r => r.item.name)).size : validCount;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Upload {entityType}s
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={uploadStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload" disabled={isUploading}>1. Upload File</TabsTrigger>
              <TabsTrigger value="preview" disabled={extractedData.length === 0}>2. Review Data</TabsTrigger>
              <TabsTrigger value="complete" disabled={uploadStep !== 'complete'}>3. Complete</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {processingStatus && (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>{processingStatus}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="file-upload">Upload CSV/Excel/JSON File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={handleFileChange}
                    className="mt-2"
                    disabled={isUploading}
                  />
                  {file && (
                    <div className="mt-2 text-sm text-gray-600">
                      Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>
                
                <div>
                  <Label>Need a template?</Label>
                  <Button 
                    variant="outline" 
                    onClick={downloadTemplate}
                    className="mt-2 w-full"
                    disabled={isUploading}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {entityType} Template
                  </Button>
                </div>
              </div>

              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Upload a CSV, Excel, or JSON file with {entityType.toLowerCase()} data. 
                  Required fields: {Object.entries(entitySchemas[entityType])
                    .filter(([, config]) => config.required)
                    .map(([field]) => field)
                    .join(', ')}
                  {entityType === 'Product' && (
                    <>. For images, use comma-separated URLs in the images column.</>
                  )}
                  {entityType === 'Shipment' && (
                    <>. For product names, use comma-separated values in the product_names column.</>
                  )}
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process File'
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {validCount} Valid Rows
                  </Badge>
                  {errorCount > 0 && (
                    <Badge variant="outline" className="text-red-600">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errorCount} Rows with Errors
                    </Badge>
                  )}
                </div>
                <Button 
                  onClick={handleImport} 
                  disabled={validCount === 0 || isImporting}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    entityType === 'Product' ? `Import ${uniqueProductsCount} Products` : `Import ${validCount} Items`
                  )}
                </Button>
              </div>

              <div className="max-h-96 overflow-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      {Object.keys(entitySchemas[entityType]).map(field => (
                        <TableHead key={field}>{field.replace(/_/g, ' ')}</TableHead>
                      ))}
                      <TableHead>Issues</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationResults.map((result) => (
                      <TableRow key={result.index}>
                        <TableCell>
                          {result.valid ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                        </TableCell>
                        {Object.keys(entitySchemas[entityType]).map(field => (
                          <TableCell key={field} className="max-w-32 truncate">
                            {String(result.item[field] || '-')}
                          </TableCell>
                        ))}
                        <TableCell>
                          <div className="text-xs space-y-1">
                            {result.errors.map((error, i) => (
                              <div key={i} className="text-red-600">{error}</div>
                            ))}
                            {result.warnings.map((warning, i) => (
                              <div key={i} className="text-yellow-600">{warning}</div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="complete" className="space-y-4">
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Import Successful!</h3>
                <p className="text-gray-600 mb-4">
                  Successfully imported {importedCount} {entityType.toLowerCase()}{importedCount === 1 ? '' : 's'} to the database.
                </p>
                <Button onClick={() => {
                  setUploadStep('upload');
                  setFile(null);
                  setExtractedData([]);
                  setValidationResults([]);
                  setImportedCount(0);
                  setErrorMessage('');
                  setProcessingStatus('');
                }}>
                  Import More Data
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
