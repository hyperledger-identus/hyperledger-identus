import { Claim } from "@/types"

export const MEDIATOR_DID = process.env.NEXT_PUBLIC_MEDIATOR_DID || "did:peer:2.Ez6LSghwSE437wnDE1pt3X6hVDUQzSjsHzinpX3XFvMjRAm7y.Vz6Mkhh1e5CEYYq6JBUcTZ6Cp2ranCWRrv7Yax3Le4N59R6dd.SeyJ0IjoiZG0iLCJzIjp7InVyaSI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCIsImEiOlsiZGlkY29tbS92MiJdfX0.SeyJ0IjoiZG0iLCJzIjp7InVyaSI6IndzOi8vbG9jYWxob3N0OjgwODAvd3MiLCJhIjpbImRpZGNvbW0vdjIiXX19";

export const BLOCKFROST_KEY = process.env.NEXT_PUBLIC_BLOCKFROST_KEY;

export const RESOLVER_URL = process.env.NEXT_PUBLIC_RESOLVER_URL;

export const RareEvoClaims: Claim[] = [
    {
        id: crypto.randomUUID(), name: "handle", value: "", type: "string"
    },
    {
        id: crypto.randomUUID(), name: "RareEvo", value: "2025", type: "string"
    },
    {
        id: crypto.randomUUID(), name: "Location", value: "Las Vegas", type: "string"
    }
]

