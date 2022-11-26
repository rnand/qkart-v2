import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { Card } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
import "./Products.css";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [prodData, setProdData] = useState([]);
  const [cartData,setCartData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [debounceTimeout,setDebounceTimeout] = useState(0);
  const [searchText,setSearchText] = useState();
  const [emptySearch,setEmptySearch] = useState(false);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setIsLoading(true);
    const url = config.endpoint + "/products";

    try {
      const response = await axios.get(url);

      setProdData(response.data);
      setIsLoading(false);
      return response.data;
    } catch (e) {
      setIsLoading(false);
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid data.",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {

    setEmptySearch(false);
    const searchUrl = config.endpoint + "/products/search?value=" + text;

    try{

      const searchResp = await axios.get(searchUrl);
      if(searchResp.length === 0){
        setEmptySearch(true);
      }else{
  
        setProdData(searchResp.data)
      }

    }catch(e){
      setEmptySearch(true);
      setProdData([]);
    }





  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {

    const value = event.target.value;
    
    if(debounceTimeout){
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout( ()=> {
      performSearch(value);
    },500);

    setDebounceTimeout(timeout);
  };

  useEffect(() => {
    const onLoad = async () => {
     const productsData = await performAPICall();
    }
    onLoad();
  }, []);



  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   * 
   */
  const fetchCart = async (token) => {
    if (!token) return;

    const url = config.endpoint + '/cart';

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(url,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },

        });
        if(response){setCartData(response.data);}
        console.log("---cart.get",response.data);
        // if(response!==null){
          // generateCartItemsFrom(response,prodData);
        // }
      
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    var isIn = false;
    items.forEach((item) => {
      if (item.productId === productId) isIn = true;
    });
    return isIn;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */

   const handleQuantity = (token,items,products,productId, qty) => {
    addToCart(token,items,products,productId, qty,{preventDuplicate:true});
  };

 
  // const addInCart = async (productId,qty) => {
    
  // }

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

    console.log("add to cart button----------",productId);
    console.log("options----------",options.preventDuplicate);
    // setCartData()

    if(token){

      if(options.preventDuplicate){

        const url = config.endpoint + '/cart';
        try{
          const resp = await axios.post(
            url,
            {productId,qty},
            {
              headers: {
                'Authorization': `Bearer ${token}` 
              }
            }
            )
            setCartData(resp.data);
            console.log("----resp---",resp.data);
        }catch(e){
      }

      }else{

          if(!isItemInCart(items,productId)){
            
            const url = config.endpoint + '/cart';
            try{
              const resp = await axios.post(
                url,
                {productId,qty},
                {
                  headers: {
                    'Authorization': `Bearer ${token}` 
                  }
                }
                )
                setCartData(resp.data);
                console.log("----resp---",resp.data);
            }catch(e){
          }
        }else {
          enqueueSnackbar(
            "Item already in cart. Use the cart sidebar to update quantity or remove item",
            { variant: "alert" }
          );
    
        }
      }

  };

}

useEffect(()=>{
  const token = localStorage.getItem('token');
  if(token !== null){

    fetchCart(token);
  }
},[]);
  




  


  if((localStorage.getItem('token'))===null){
    return (

      <div>
      <Header hasHiddenAuthButtons={"prodPage"}>

      <TextField 
         className="search-desktop"
         size = "small"
         InputProps={{
          className:"search",
          endAdornment:(
            <InputAdornment position="end">
            <Search color="primary" />
            </InputAdornment>
          )
         }}
         placeholder="Search for items/categories"
         name="search"
         onChange={(e) => debounceSearch(e, debounceTimeout)} 
         />

      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      />
      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
      </Grid>
      {/* {console.log(prodData)} */}

       {isLoading?(<div className="loading"><label>Loading Products</label><CircularProgress /></div>):(
        
        emptySearch?(<div ><label>No products found</label></div>):(
      
        <Box>

            {/* <Grid container spacing={2} columns={16}>
              <Grid item xs={8}>
               xs=8
              </Grid>
              <Grid item xs={8}>
                xs=8
              </Grid>
            </Grid> */}

          {/* <Grid container spacing={4}>
            {prodData.map( (prod) => (
              <Grid item xs={12} md={3} sm={6} key={prod._id} >
              <ProductCard product={prod} />
            </Grid>
            ))}
            
          </Grid> */}
          

          <Grid container spacing={4}>
            {prodData.map( (prod) => (
              <Grid item md={4} key={prod._id} >
              <ProductCard product={prod} handleAddToCart={addToCart}/>
            </Grid>
            
            ))}
            
            
          </Grid>
        </Box>
        )

      )}
      
      
      
      

      <Footer />
    </div>

    )
  }else{
    return (
      <div>
        <Header hasHiddenAuthButtons={"prodPage"}>
  
        <TextField 
           className="search-desktop"
           size = "small"
           InputProps={{
            className:"search",
            endAdornment:(
              <InputAdornment position="end">
              <Search color="primary" />
              </InputAdornment>
            )
           }}
           placeholder="Search for items/categories"
           name="search"
           onChange={(e) => debounceSearch(e, debounceTimeout)} 
           />
  
        </Header>
  
        <TextField
          className="search-mobile"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
        <Grid container>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
        </Grid>
        {/* {console.log(prodData)} */}
  
         {isLoading?(<div className="loading"><label>Loading Products</label><CircularProgress /></div>):(
          
          emptySearch?(<div ><label>No products found</label></div>):(
        
          <Box>
  
              {/* <Grid container spacing={2} columns={16}>
                <Grid item xs={8}>
                 xs=8
                </Grid>
                <Grid item xs={8}>
                  xs=8
                </Grid>
              </Grid> */}
  
            {/* <Grid container spacing={4}>
              {prodData.map( (prod) => (
                <Grid item xs={12} md={3} sm={6} key={prod._id} >
                <ProductCard product={prod} />
              </Grid>
              ))}
              
            </Grid> */}
            
  
            <Grid container spacing={4}>
              {prodData.map( (prod) => (
                <Grid item xs={6} md={3} key={prod._id} >
                <ProductCard product={prod} handleAddToCart={ () => addToCart(
                  localStorage.getItem('token'),
                  cartData,
                  prodData,
                  prod._id,
                  1,
                )}/>
              </Grid>
              
              ))}
              <Grid item md={3}>
                <Cart products={prodData} items={cartData} handleQuantity={handleQuantity} />
              </Grid>
              
            </Grid>
          </Box>
          )
  
        )}
        
        
        
        
  
        <Footer />
      </div>
    );

  }


  
};
export default Products;
