package com.sheldon.rest.common.representation;

import org.jboss.resteasy.plugins.providers.atom.Link;

import java.util.List;

/**
 * Created by Sheld on 6/20/2017.
 */
public abstract class BaseRepresentation {
    protected List<Link> links;

    public List<Link> getLinks() {
        return links;
    }

    public void setLinks(List<Link> links) {
        this.links = links;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        BaseRepresentation that = (BaseRepresentation) o;

        return links != null ? links.equals(that.links) : that.links == null;
    }

    @Override
    public int hashCode() {
        return links != null ? links.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "BaseRepresentation{" +
                "links=" + links +
                '}';
    }
}
