import { useState, useEffect } from 'react';
import Card from '../UI/Card/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';

const { REACT_APP_FIREBASE_API } = process.env;

const AvailableMeals = () => {
    const [meals, setMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            const response = await fetch(`${REACT_APP_FIREBASE_API}availableMeals.json`);
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }
            const data = await response.json();
            const transformedData = [];

            for (const key in data) {
                transformedData.push({
                    id: key,
                    name: data[key].name,
                    description: data[key].description,
                    price: data[key].price
                })
            }
            setMeals(transformedData);

            setIsLoading(false)
        }

        fetchMeals().catch(error => setIsError(error.message));
    }, []);


    if (isLoading) {
        return (
            <section className={classes.isLoading}>
                <p>Loading...</p>
            </section>
        )
    }

    if (isError) {
        return (
            <section className={classes.isError}>
                <p>{isError}</p>
            </section>
        )
    }

    if (meals.length === 0) {
        return (
            <section className={classes.noMealsFound}>
                <p>No meals found.</p>
            </section>
        )

    }
    const mealsList = meals.map(meal => {
        return <MealItem
            id={meal.id}
            key={meal.id}
            name={meal.name}
            description={meal.description}
            price={meal.price}
        />
    })


    return <section className={classes.meals}>
        <Card>
            <ul>
                {mealsList}
            </ul>
        </Card>
    </section>
}

export default AvailableMeals