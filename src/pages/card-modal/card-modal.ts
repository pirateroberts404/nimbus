import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

import { FormBuilder, Validators } from '@angular/forms';
import { StripeService } from '../../providers/stripe/stripe';

declare var Stripe: any;


@Component({
  selector: 'card-modal',
  templateUrl: 'card-modal.html'
})
export class CardModalPage {
  cardForm: any;
  cardNumberChanged: boolean;
  cvcChanged: boolean;
  expMonthChanged: boolean;
  expYearChanged: boolean;
  errorMessage: string;

  constructor(public navCtrl: NavController,
              public stripeService: StripeService,
              public formBuilder: FormBuilder,
              public viewController: ViewController) {
    this.cardNumberChanged = false;
    this.cvcChanged = false;
    this.expMonthChanged = false;
    this.expYearChanged = false;

    this.cardForm = formBuilder.group({
      number: ["", Validators.compose([Validators.required, this.checkCreditCardNumber])],
      cvc: ["", Validators.compose([Validators.required, this.checkCVC])],
      exp_month: ["", Validators.required],
      exp_year: ["", Validators.required]
    }, {validator: this.checkExpiryDate('exp_month', 'exp_year')});
  }

  checkCreditCardNumber(control) {
    if (!Stripe.card.validateCardNumber(control.value)) {
      return {checkCreditCardNumber: true}
    }
    else {
      return null;
    }
  }

  checkCVC(control) {
    if (!Stripe.card.validateCVC(control.value)) {
      return {checkCVC: true}
    }
    else {
      return null;
    }
  }

  checkExpiryDate(monthKey, yearKey) {
    return (group) => {
      let month = group.controls[monthKey];
      let year = group.controls[yearKey];
      if (!Stripe.card.validateExpiry(month.value, year.value)) {
        return year.setErrors({checkExpiryDate: true});
      }
      else {
        return year.setErrors(null);
      }
    }
  }

  submit() {
    this.stripeService.createToken(this.cardForm.value)
      .then(response => {
        if (response['error']) {
          this.errorMessage = response['error'].message;
        }
        else {
          console.log(response);
          this.viewController.dismiss(response);
        }
      })
  }

  dismiss() {
    this.viewController.dismiss("User dimiss");
  }
}