import React, { useEffect } from "react";
import ListReview from "./list-review";
import { useState } from "react";
import FormComment from "./form-comment";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../../config/axiosConfig";

function Review() {
  const { t } = useTranslation();

 
  ////////////////////////////////////////////
  const { id } = useParams();
  console.log(' id---from Review component------------>',id);
  
  const [ID, setId] = useState('');

  useEffect(()=>{
    setId(id)
  },[id])

  const book = useSelector((state) => state.books.books.find((book) => book._id === id));
  const [bookReviews, setReviews] = useState([]);
  const token = localStorage.getItem('user');
  console.log('token------>',token);

  useEffect(() => {
    axios.get(`/review/book/${book._id}`).then((data) => {
      console.log('data------>',data);
      setReviews(data.data.bookReviews);
    }).catch((err) => {
      console.log(err);
    });
  }, [])
  console.log(' data---bookReviews--->',bookReviews);

  const addReview = (review) => {
    axios.post(`/review/book/${book._id}`, review).then((data) => {

      console.log('addReview fun.',data.data.review);
      axios.get(`/users/${review.user}`,{ headers: {
          Authorization: `Bearer ${token}`,
        },}
      ).then((res)=>{
      
        console.log('zzzzzzzzz',res.data.user);
        const populatedReview = {
          ...review,
          user:res.data.user
        }
        setReviews([populatedReview, ...bookReviews]);
        console.log('populatedReview',populatedReview);
        
      })
    }).catch((err) => {
      console.log(err);
    });
    console.log('ffffffff',review);
  };
  bookReviews.map((review) => {
    console.log('review user:', review.user.firstName);
  });


  return (
    <>
      <div className="container">
        <div className="row" style={{ width: "50%" }}>
          <div className="heading d-flex flex-column align-items-start">
            <div>
              <h2>{t("review.title")}</h2>
            </div><div className="small"></div>
          </div>
          <FormComment addReview={addReview} />
          <ListReview WWE={bookReviews} bookId={ID}/>
        </div>
      </div>
    </>
  );
}

export default Review;
