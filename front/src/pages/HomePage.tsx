import { useState, useEffect } from 'react';
import axios from "axios";
import Button from "../components/Button"
import Input from '../components/Input';

interface Product {
    name: string;
    prix: number;
    stock: number;
}

function Homepage(){
    /**
     * States
     */
    const [count, setCount] = useState<number>(0);
    const [value, setValue] = useState<string>("");
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    /**
     * Handlers
     */

    const augmenterValeur = () => {
        setCount((prevState) => prevState + 1);
    };
    
    const reduireValeur = () => {
        setCount((prevState) => prevState - 1);
    };
    
    const onChangePrenom: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.target.value);
    }

    /**
     * Side-Effects
     */

    useEffect(() => {
        setIsLoading(true);

        axios.get("http://localhost:4200/getProducts").then((res) => {
            setIsLoading(false);
            setProducts(res.data);
        }).catch(err => {
            setIsLoading(false);
            setError(err.message)
        });
    }, []);

    /**
     * Render
     */
    
    if(error){
        return <p style={{color: 'red', fontSize: '40px'}}>{error}</p>
    }

    if(products.length === 0){
        return <></>;
    }

    const productsToDisplay = products.map(x => <div key={x.name}>
        <p>{x.name}</p>
        <p>{x.prix}</p>
        <p>{x.stock}</p>
    </div>);
    
    return (
        isLoading ? <p>Loading...</p> : <div>
            <p>HomePage</p>
            <p>Ma valeur : {count}</p>
            <Button label="Augmenter ma valeur" onClick={augmenterValeur}/>
            <Button label="Réduire ma valeur" onClick={reduireValeur}/>
            <Input label="Prénom" value={value} onChange={onChangePrenom}/>
            {productsToDisplay}
        </div>
    )
};

export default Homepage;
