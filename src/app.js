import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRoutePath from "./routes/user.route.js"
import {videoRouter}  from "./routes/video.route.js"
import { tweetRouter } from "./routes/tweet.route.js"
import { subscriptionsRouter } from "./routes/subscription.route.js"
import { playlistRouter } from "./routes/playlist.route.js"
import { LikeRouter } from "./routes/like.route.js"
import { CommentRouter } from "./routes/comment.route.js"
import { DashboardRouter } from "./routes/dashboard.route.js"
import { HealthcheckRouter } from "./routes/healthcheck.route.js"
const app=express()


app.use(cors())
cors({
    "origin":process.env.ORIGIN_DB,
    credentials: true
})
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({ extended: true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use('/api/v1/users',userRoutePath)
app.use('/api/v1/videos',videoRouter)
app.use('/api/v1/tweets',tweetRouter)
app.use('/api/v1/subscriptions',subscriptionsRouter)
app.use('/api/v1/playlist',playlistRouter)
app.use('/api/v1/like',LikeRouter)
app.use('/api/v1/comment',CommentRouter)
app.use('/api/v1/dashboard',DashboardRouter)
app.use('/api/v1/healthcheck',HealthcheckRouter)

export {app}