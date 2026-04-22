import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'

const FoodItem = ({id,name,price,description,image}) => {

    const {cartItems,addToCart,removeFromCart,url}=useContext(StoreContext);
    const handleAddToGroup = async (id) => {
    addToCart(id);

    const groupId = localStorage.getItem("groupId");

    if (!groupId) return;

    try {
        await axios.post( url + "/api/group/add-item",
            {
                groupId,
                item: {
                    _id: id,
                    name,
                    price
                }
            },
            {
                headers: {
                    token: localStorage.getItem("token")
                }
            }
        );

        console.log("Added to group cart");

    } catch (error) {
        console.log(error);
    }
};


  return (
    <div className='food-item'>
        <div className="food-item-img-container">
            <img className='food-item-image' src={url+"/images/"+image} alt="" />
            {
                    !cartItems?.[id]
                    ?<img className='add' onClick={()=>handleAddToGroup(id)} src={assets.add_icon_white} alt="" />
                    : <div className="food-item-counter">
                        <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                        <p>{cartItems?.[id]}</p>
                        <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" />
                    </div>
            }
        </div>
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <img src={assets.rating_starts} alt="" />
            </div>
            <p className="food-item-desc">{description}</p>
            <p className="food-item-price">${price}</p>
        </div>
    </div>
  )
}

export default FoodItem
