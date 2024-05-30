/**
 * some common types because of react native lifecycle warning  
 */

import { TopicConfig } from "./Layout"


/**
 * available topics  
 * These are the available topics that can be set as `topic` state var in Layout  
 */
export const topicsAvailable = ["german", "geography", "italian", "spanish", "french", "history"] as const

export const TopicConfigDefault: TopicConfig = {
    cardsLearning: [],
    cardsPerDay: 1,
    mediums: ["img", "text", "audio"],
    interval: 1000 * 60 * 1 // 1min 
}
