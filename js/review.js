const get_reviews = async () => {
    const reviews = await lifescope_getter('review');
    console.log(reviews);
}
