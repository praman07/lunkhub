import { getLinks, linkClick, addLink, updateLinkApi, deleteLinkApi } from '../services/home.api'


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

    const modifyLink = async ({ linkId, title, url }) => {
        try {
            const response = await updateLinkApi({ linkId, title, url })
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const removeLink = async ({ linkId }) => {
        try {
            const response = await deleteLinkApi({ linkId })
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    return {
        fetchLinks,
        handleLinkClick,
        createNewLink,
        modifyLink,
        removeLink
    }

}