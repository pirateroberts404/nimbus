import { Item } from './item';

export class Order {
  id: number;
  retailer_id: number;
  retailer_name: string;
  retailer_image: string;
  distribution_channel: string;
  order_details: Item[];
  address: string;
  total_price: number;
  status: string;
  show: boolean;
}