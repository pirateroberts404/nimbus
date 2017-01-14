import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Order } from '../../models/order'
import { Cart } from '../../models/cart'
import { OrdersPage } from '../orders/orders'
import { CartService } from '../../providers/cart/cart';
import { OrderService } from '../../providers/orders/orders';
import { AuthenticationService } from '../../providers/authentication/authentication'
import { CheckoutPage } from '../checkout/checkout';
import { ItemDetailsPage } from '../item-details/item-details';

import _ from 'underscore';

@Component({
  selector: 'cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  carts: any;
  order: Order;

  constructor(public navCtrl: NavController,
              public cartService: CartService,
              public orderService: OrderService,
              public alertCtrl: AlertController,
              public auth: AuthenticationService) {

  }

  public ionViewDidLoad(): void {
    this.carts = _.values(this.cartService.getAll());
    this.carts.itemCount = this.cartService.itemCount;
    this.order = new Order();
  };

  goToOrders() {
    this.navCtrl.push(OrdersPage);
  }

  goToCheckout() {
    if(this.auth._currentUserData) {
      this.navCtrl.push(CheckoutPage, {
        order: this.order
      });
    } else {
      let alert = this.alertCtrl.create({
        title: 'Login Needed',
        subTitle: 'Please login first before placing your order.',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  editItem(item) {
    item.edit = true;
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    })
  }

  checkoutCart(dispensaryName) {
    this.order.order_details = this.cartService.carts[dispensaryName].content;
    this.order.total_price = this.cartService.carts[dispensaryName].total;
    this.order.medical = this.cartService.carts[dispensaryName].dispensary.medical;
    this.order.mail = this.cartService.carts[dispensaryName].dispensary.mail;
    this.order.pickup = this.cartService.carts[dispensaryName].dispensary.pickup;
    this.order.delivery = this.cartService.carts[dispensaryName].dispensary.delivery;
    this.order.delivery_fee = this.calculateShippingCost(this.cartService.carts[dispensaryName]);
    this.order.tax_amount = Number((this.order.total_price * 0.13).toFixed(2)); //TODO: this should not be hard coded
    this.order.dispensary_name = dispensaryName;
    this.order.show = false;

    this.goToCheckout();

    this.order = new Order();
  }

  calculateShippingCost(cart: Cart): number {
    if(cart.dispensary.free_shipping_cap != null && cart.total >= cart.dispensary.free_shipping_cap) {
      return 0;
    }
    return cart.dispensary.shipping_fee;
  }
}
