import { getLinks, linkClick, addLink } from '../services/home.api'


export const useHome = () => {

    const fetchLinks = async ({ username }) => {
        try {
            const links = await getLinks({ username })
            return links
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const handleLinkClick = async ({ linkId }) => {
        try {
            const response = await linkClick({ linkId })
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const createNewLink = async ({ title, url }) => {
        try {
            const response = await addLink({ title, url })
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    return {
        fetchLinks,
        handleLinkClick,
        createNewLink
    }

}