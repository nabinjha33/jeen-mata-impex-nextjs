'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';

interface Variant {
  id: string;
  size: string;
  packaging: string;
  estimated_price_npr: number;
  stock_status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Pre-Order';
}

interface VariantManagerProps {
  variants: Variant[];
  setVariants: (variants: Variant[]) => void;
}

export default function VariantManager({ variants, setVariants }: VariantManagerProps) {
  const handleAddVariant = () => {
    const newVariant: Variant = {
      id: `var_${Date.now()}`,
      size: '',
      packaging: '',
      estimated_price_npr: 0,
      stock_status: 'In Stock',
    };
    setVariants([...variants, newVariant]);
  };
  
  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };
  
  const handleVariantChange = (id: string, field: keyof Variant, value: string | number) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      {variants.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead>Packaging</TableHead>
              <TableHead>Est. Price (NPR)</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map(variant => (
              <TableRow key={variant.id}>
                <TableCell>
                  <Input 
                    value={variant.size} 
                    onChange={e => handleVariantChange(variant.id, 'size', e.target.value)}
                    placeholder="e.g., 13mm, Large, XL"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={variant.packaging} 
                    onChange={e => handleVariantChange(variant.id, 'packaging', e.target.value)}
                    placeholder="e.g., Box, Unit, Pack"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={variant.estimated_price_npr} 
                    onChange={e => handleVariantChange(variant.id, 'estimated_price_npr', Number(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </TableCell>
                <TableCell>
                  <Select 
                    value={variant.stock_status} 
                    onValueChange={value => handleVariantChange(variant.id, 'stock_status', value as Variant['stock_status'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Pre-Order">Pre-Order</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveVariant(variant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <PlusCircle className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2">No variants added yet</p>
          <p className="text-sm">Add variants to specify different sizes, packaging, or pricing options</p>
        </div>
      )}
      
      <Button type="button" variant="outline" onClick={handleAddVariant}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Variant
      </Button>
    </div>
  );
}
