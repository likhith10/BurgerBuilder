import React, { Component } from 'react';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import { connect } from 'react-redux';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../Store/actions/index';
import axios from '../../axios-orders';




class BurgerBuilder extends Component {



 state = {

    purchasing: false,
    loading: false,
    error:false

 }
 componentDidMount() {
     this.props.onInitIngredients();
    // axios.get('https://burger-builder-fa6eb.firebaseio.com/ingredients.json')
    // .then(response => {this.setState({ingredients: response.data});
    //}).catch(error => {this.setState({error:true})})
    //;
 }

 updatePurchaseState (ingredients) {
 
  const sum = Object.keys(ingredients).map(igKey => {
      return ingredients[igKey];
  })
  .reduce((sum, el) => {
      return sum + el;
  }, 0);
  
  return sum > 0;
 }



 purchaseHandler = () => {
     if (this.props.isAuthenticated){
     this.setState({purchasing: true});
     } else {
         this.props.onSetAuthRedirectPath('/checkout');
         this.props.history.push('/auth');
     }
 }
purchaseCancelHandler = () => {
  this.setState({purchasing: false});  
}
purchaseContinueHandler = () => {  
    this.props.onInitPurchase();
    this.props.history.push('/checkout');      
} 
    render() {
        const disabledInfo = {
         ...this.props.ings   

        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
let  orderSummary = null;      
let burger = this.props.error ? <p>Ingredients cant be loaded </p> : <Spinner/>;
if(this.props.ings)
{         burger =  (
        <Auxiliary>
        <Burger ingredients={this.props.ings} 
        />
        <BuildControls 
        ingredientAdded={this.props.onIngredientAdded}
        ingredientRemoved={this.props.onIngredientRemoved}
        disabled={disabledInfo}
        purchasable={this.updatePurchaseState(this.props.ings)}
        price={this.props.price}
        ordered={this.purchaseHandler} 
        isAuth={this.props.isAuthenticated}/>
        </Auxiliary>);
         orderSummary =  <OrderSummary ingredients = {this.props.ings}
         purchaseCancelled={this.purchaseCancelHandler}
         purchaseContinued={this.purchaseContinueHandler}
         price={this.props.price.toFixed(2)}
         />      
}

        return(
        <Auxiliary >
            <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} > 
           {orderSummary}

           </Modal>    
           {burger} 
        </Auxiliary>    
        );
    }
}

const mapStateToProps = state => {
 return{
     ings: state.burgerBuilder.ingredients,
     price: state.burgerBuilder.totalPrice,
     error: state.burgerBuilder.error,
     isAuthenticated: state.auth.token !== null
 }

}

const mapDispatchToProps = dispatch => {
  return {
     onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)), 
   onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
   onInitIngredients: () => dispatch(actions.initIngredients()),
   onInitPurchase: () => dispatch(actions.purchaseInit()),
   onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
}
}



export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));