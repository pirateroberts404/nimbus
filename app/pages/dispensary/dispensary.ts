import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController} from 'ionic-angular';

import { MenuService } from '../../providers/menu/menu';
import { DispensaryService } from '../../providers/dispensary/dispensary';

import { Item } from '../../models/item';
import { ItemDetailsPage } from '../item-details/item-details';
import { CartPage } from '../cart/cart';
import { CartService } from '../../providers/cart/cart';
import { NimbusBar } from '../../components/nimbus-bar/nimbus-bar';

import * as _ from 'underscore';

@Component({
  templateUrl: 'build/pages/dispensary/dispensary.html',
  providers: [DispensaryService, MenuService],
  directives: [NimbusBar]
})
export class DispensaryPage {
  selectedDispensary: any;
  menu: Item[];
  menuCategories: any[];

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private dispensaryService: DispensaryService,
              private cartService: CartService,
              private menuService: MenuService,
              private loadingCtrl: LoadingController) {
    this.selectedDispensary = navParams.get('dispensary');
    this.loadMenu();
  }

  loadMenu() {
    var loader = this.loadingCtrl.create({});
    loader.present();

    this.dispensaryService.getDispensaryMenu(this.selectedDispensary.id)
      .then(response => {
        console.log(response);
        this.menu = response as Item[];

        this.menuCategories = [];
        for (var category of _.uniq(_.pluck(this.menu, 'category'))) {
          this.menuCategories.push ({
            name: category,
            show: false,
            items: _.where(this.menu, {category: category}) as Item[]
          })
        }

        loader.dismiss();
      });
  }
  toggleMenuCategory(category) {
    category.show = !category.show;
  }

  isCategoryShown(category) {
    return category.show;
  }

  itemSelected(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }

  goToCart() {
    this.navCtrl.push(CartPage);
  }

  consoleLog() {
    console.log("Alex was here");
  }

  renderItemDescription(item: Item) {
    switch(item.category) {
      case "Flowers":
        var desc = "";
        if (item.thc == 0 && item.cbd == 0 ) {
          desc += "No Lab Tests | ";
        } else {
          desc += "THC: " + item.thc + "% CBD: " + item.cbd + "% | ";
        }
        desc += "$" + item.prices[0] + " / " + item.price_labels[0];
        return desc

      case "Hybrid":
        var desc = "";
        if (item.thc == 0 && item.cbd == 0 ) {
          desc += "No Lab Tests | ";
        } else {
          desc += "THC: " + item.thc + "% CBD: " + item.cbd + "% | ";
        }
        desc += "$" + item.prices[0] + " / " + item.price_labels[0];
        return desc

      case "Indica":
        var desc = "";
        if (item.thc == 0 && item.cbd == 0 ) {
          desc += "No Lab Tests | ";
        } else {
          desc += "THC: " + item.thc + "% CBD: " + item.cbd + "% | ";
        }
        desc += "$" + item.prices[0] + " / " + item.price_labels[0];
        return desc

      case "Sativa":
        var desc = "";
        if (item.thc == 0 && item.cbd == 0 ) {
          desc += "No Lab Tests | ";
        } else {
          desc += "THC: " + item.thc + "% CBD: " + item.cbd + "% | ";
        }
        desc += "$" + item.prices[0] + " / " + item.price_labels[0];
        return desc

      case "Cartridges":
        return "THC: " + item.thc + "% CBD: " + item.cbd + "% | " + "$" + item.prices[0];
      case "Vaporizers":
        return "$" + item.prices[0];
      case "Concentrates":
        return "THC: " + item.thc + "% CBD: " + item.cbd + "% | " + "$" + item.prices[0];
      case "Edibles":
        return "THC: " + item.thc + "mg CBD: " + item.cbd + "mg | " + "$" + item.prices[0];
      case "Cannabis Oil (Tears)":
        return "THC: " + item.thc + "% CBD: " + item.cbd + "% | " + "$" + item.prices[0];
      case "Pre-rolls":
        var desc = ""
        if (item.thc == 0 && item.cbd == 0 ) {
          desc += "No Lab Tests | ";
        } else {
          desc += "THC: " + item.thc + "% CBD: " + item.cbd + "% | ";
        }
        desc += "$" + item.prices[0];
        return desc
      case "Capsules":
        return "THC: " + item.thc + "mg CBD: " + item.cbd + "mg | " + "$" + item.prices[0];
      default:
        return "$" + item.prices[0];
    }
  }
}
