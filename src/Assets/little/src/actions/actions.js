import fetch from 'isomorphic-fetch'
import Jquery from 'jquery'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_REDDIT = 'SELECT_REDDIT'
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'

export function selectReddit(reddit) {
    return {
        type: SELECT_REDDIT,
        reddit
    }
}

export function invalidateReddit(reddit) {
    return {
        type: INVALIDATE_REDDIT,
        reddit
    }
}

function requestPosts(reddit) {
    return {
        type: REQUEST_POSTS,
        reddit
    }
}

function receivePosts(reddit, json) {
    return {
        type: RECEIVE_POSTS,
        reddit,
       // posts: json.data.children.map(child => child.data),
        posts: json,
    receivedAt: Date.now()
}
}

function fetchPosts(reddit) {
    return dispatch =>
    {
        dispatch(requestPosts(reddit))
        return Jquery.ajax({
            url: `http://khangulz.app/solar/tp/test2`,
            type: 'POST',
                headers: {
                'X-CSRF-TOKEN': Jquery('meta[name="csrf-token"]').attr('content')
            },
            data:{
                type: reddit
            }
        })
        .then(data => dispatch(receivePosts(reddit, data)))

    }
}

//function fetchPosts(reddit) {
//    return dispatch => {
//        dispatch(requestPosts(reddit))
//        return fetch(`http://khangulz.app/solar/tp/test2/${reddit}`)
//            .then(req => req.json())
//    .then(json => dispatch(receivePosts(reddit, json)))
//    }
//}

function shouldFetchPosts(state, reddit) {
    const posts = state.postsByReddit[reddit]
    if (!posts) {
        return true
    } else if (posts.isFetching) {
        return false
    } else {
        return posts.didInvalidate
    }
}

export function fetchPostsIfNeeded(reddit) {
    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), reddit)) {
            return dispatch(fetchPosts(reddit))
        }
    }
}