import Axios from "axios";

const api = Axios.create({
  baseURL: "https://red-octopus.herokuapp.com/api",
});

export const getarticles = async (params) => {
  const { data } = await api.get("/articles", { params });
  return data;
};

export const getarticle = async (article_id) => {
  const params = { params: {} };
  const { data } = await api.get(`/articles/${article_id}`, { params });
  return data;
};

export const getcomments = async (article_id, params) => {
  const { data } = await api.get(`/articles/${article_id}/comments/`, {
    params,
  });
  return data;
};

export const gettopics = async () => {
  const { data } = await api.get(`/topics`, {});
  return data;
};

export const getusers = async () => {
  const { data } = await api.get(`/users`, {});
  return data;
};

export const postcomment = async (article_id, username, body, created_at) => {
  const { data } = await api.post(`/articles/${article_id}/comments/`, {
    username,
    body,
    created_at,
  });

  return data;
};

export const deletecomment = async (comment_id) => {
  const { data } = await api.delete(`/comments/${comment_id}`, {});

  return data;
};

export const votecomment = async (comment_id, inc_votes) => {
  const { data } = await api.patch(`/comments/${comment_id}`, { inc_votes });

  return data;
};

export const votearticle = async (article_id, inc_votes) => {
  const { data } = await api.patch(`/articles/${article_id}`, { inc_votes });

  return data;
};

export const deletearticle = async (article_id) => {
  const { data } = await api.delete(`/articles/${article_id}`, {});

  return data;
};

export const addarticle = async (article) => {
  const { author, title, body, topic, image_url, created_at } = article;

  const { data } = await api.post(`/articles/`, {
    author,
    title,
    body,
    topic,
    image_url,
    created_at,
  });

  return data;
};

export const getuser = async (username) => {
  const { data } = await api.get(`/users/${username}`);

  return data;
};

export const addtopic = async (topic) => {
  const { slug, description } = topic;

  const { data } = await api.post(`/topics/`, {
    slug,
    description,
  });

  return data;
};
