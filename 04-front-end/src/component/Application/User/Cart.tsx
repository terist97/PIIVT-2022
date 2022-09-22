import { faSquareMinus } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { api } from '../../../api/api';
import MyCartStore from '../../../stores/MyCartStore';


export default function Cart() {

    const [cartState, setCartState] = useState(MyCartStore.getState())
    const [isCartConfirmed, setIsCartConfirmed] = useState(false)
    const [sentData, setIsDataSent] = useState(false)
    const [setName, setUserName] = useState("")

    const [ forename, setForename ] = useState<string>("");
    const [ surname, setSurname ] = useState<string>("");
    const [ address, setAddress ] = useState<string>("");
    const [ email, setEmail ] = useState<string>("");
    const [ price, setPrice ] = useState<Number>(0);
    let total=0;
    const itemsToSend: Array<number> = [];
    const sendInfo = () => {
        api("post", "/api/order", "visitor", { forename, surname, address, email })
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not send data. Reason: " + JSON.stringify(res.data));
            }

            return res.data;
        })
    }
    

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                {cartState.items.map((itemCart) => {
                    {total+=itemCart.price}
                    {itemsToSend.push(itemCart.itemId)}
                    console.log(itemsToSend)
                    return (
                       
                             <div className="card" style={{ width:"350px",height:"37vh", margin: "15px" }}>
            
              <img
                className="card-img-top"
                src={"http://localhost:10000/assets/" + itemCart.photo_path}
                style={{ width: "100%", height: "20vh" }}
              />

              <div className="card-body">
                <h4 className="card-title">{itemCart.name}</h4>

                <p className="card-text">{itemCart.price}</p>
                
                <button  className="btn btn-danger"
                                onClick={() => {
                                    MyCartStore.dispatch({ type: "remove_from_cart", value: itemCart })

                                    window.location.reload()
                                }}  >
                                    
                                    <FontAwesomeIcon icon={ faSquareMinus } /> Remove from cart
                            </button>
                        
              </div>
            
            
          </div>
                            
                        
                    )
                })
                }
            
            {/* <button 
                onClick={() => {
                    MyCartStore.dispatch({ type: "empty_cart" })

                    window.location.reload()
                }}>
                Empty cart
            </button> */}
            <button className="btn btn-primary"
            disabled={cartState.items.length===0}
            onClick={() => { setIsCartConfirmed(true)  }
            
            }>
                Confirm my order
            </button>
           
            

           </div>
           <div className="col">
                {isCartConfirmed  &&
                <form>
                    
                    <div className="form-group mb-3">
                    <div className="input-group">
                        <input className="form-control" type="text" placeholder="Enter your forename" value={ forename }
                               onChange={ e => setForename(e.target.value) } />
                    </div>
                </div>

                <div className="form-group mb-3">
                    <div className="input-group">
                        <input className="form-control" type="text"   placeholder="Enter your surname" value={ surname }
                               onChange={ e => setSurname(e.target.value) }/>
                    </div>
                </div>
                <div className="form-group mb-3">
                    <div className="input-group">
                        <input className="form-control"  type="text"  placeholder="Enter your address" value={ address }
                               onChange={ e => setAddress(e.target.value) }/>
                    </div>
                </div>
                <div className="form-group mb-3">
                    <div className="input-group">
                        <input className="form-control" type="text"   placeholder="Enter your email" value={ email }
                               onChange={ e => setEmail(e.target.value) }/>
                    </div>
                </div>
                   
                    
                   
                    <button className="btn btn-primary mt-2" type='button' onClick={() =>  {
                       
                       { setIsDataSent(true) }
                       
                       

                    // MyCartStore.dispatch({ type: "empty_cart" })
                    

                    // window.location.reload()
                }} >
                    
                        Prikazi uplatnicu
                    </button>
                </form>
            }
             {sentData &&
             <div>
       <div>Uplatilac:</div>
       <div style={{border:"1px solid black"}}>{surname} {forename},<br></br> {address}  <br></br>
       Email:{email}</div>
       <div className="mt-2">Svrha uplate:</div>
       <div style={{border:"1px solid black"}}>Kupovina tehnickih proizvoda</div>
       <div className="mt-2">Primalac:</div>
       <div style={{border:"1px solid black"}}>Firma doo, adresa firme Vojvode stepe 121</div>
       <div className="mt-2">Racun primaoca:</div>
       <div style={{border:"1px solid black"}}>170-23003045251-65</div>
       <div className="mt-2">Poziv na broj</div>
       <div style={{border:"1px solid black"}}>3045251-65</div>
       <div className="mt-2">Iznos</div>
       <div style={{border:"1px solid black"}}>{total}.00 RSD</div>
      
           <button className="btn btn-primary mt-2" type='submit'onClick={() =>  {                                                                    
                       MyCartStore.dispatch({ type: "empty_cart" })  
                       sendInfo()                    
                       window.location.reload()
                  }} >Send my data</button>
           </div>
           }
           </div>
          
            </div>
            
        </div>
        );
}