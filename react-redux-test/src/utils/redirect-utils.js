/**
 * Created by Sheldon Lee on 4/22/2017.
 */
export function redirectUtils(e, path) {
    e.preventDefault();
    e.stopPropagation();
    this.props.redirect(path);
}