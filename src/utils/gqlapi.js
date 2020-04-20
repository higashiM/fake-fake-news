const { createApolloFetch } = require("apollo-fetch");
const fetch = createApolloFetch({
  uri: "https://red-octopus.herokuapp.com/graphql",
});

export const getarticles = () => {
  return fetch({
    query: `{articles{
    article_id 
    title
    body
  }}`,
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};
