export const API = {
    "user": {
        "login": "http://localhost:3001/user/login",
        "register": "http://localhost:3001/user/register",
        "jwtVerify": "http://localhost:3001/user/jwt",
        "passwordVerify": "http://localhost:3001/user/verify",
        "update": "http://localhost:3001/user/",
    },
    "map": "http://localhost:3001/map",
    "graph": "http://localhost:3001/map/:mapId/graph",
    "node": "http://localhost:3001/graph/:graphId/node",
    "link": "http://localhost:3001/graph/:graphId/link",
    "notebook": {
        "all": "http://localhost:3001/graph/:graphId/allNotebook",
        "normal": "http://localhost:3001/graph/:graphId/:target/:targetId/notebook",
        "node": "http://localhost:3001/graph/:graphId/node/:nodeId/notebook",
        "link": "http://localhost:3001/graph/:graphId/link/:linkId/notebook",
    }
}